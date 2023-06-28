import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Hl7Object } from './models/hl7-object.entity';
import { UserSample } from '../../samples/src/models/user-sample.entity';
import { Hl7ObjectStatuses } from '../../common/src/resources/hl7/hl7-object-statuses';
import { Hl7FilesService } from './hl7-files.service';
import { FilesService } from '../../files/src/files.service';
import { InternalFileTypes } from '../../common/src/resources/files/file-types';
import { HL7_FILE_TYPE, PDF_CONTENT_TYPE } from '../../common/src/resources/files/files-validation-rules';
import { Hl7FtpService } from './hl7-ftp.service';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { BIOMARKER_MAPPING_ERROR, DEV_ADMIN_EMAILS, INVALID_CUSTOMER_ID, INVALID_SAMPLE_ID_ERROR, OBJECT_ALREADY_PROCESSED_ERROR, PROD_ENVS, SAMPLE_CODE_FROM_PDF_RESULT_FILE, SAMPLE_CODE_FROM_RESULT_FILE, SAMPLE_CODE_FROM_STATUS_FILE, SUPER_ADMIN_EMAIL, UNIT_MISMATCH_ERROR } from '../../common/src/resources/hl7/hl7-constants';
import axios from 'axios';
import { DateTime } from 'luxon';
import { AdminsResultsService } from '../../admins-results/src/admins-results.service';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { Hl7CriticalRange } from './models/hl7-critical-range.entity';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { UsersService } from '../../users/src/users.service';
import { Hl7FileError } from './models/hl7-file-error.entity';
import { Hl7ErrorNotificationsService } from '../../hl7-error-notifications/src/hl7-error-notifications.service';
import { KlaviyoModelService } from '../../klaviyo/src/klaviyo-model.service';
import { KlaviyoService } from '../../klaviyo/src/klaviyo.service';
import { RecommendationTypes, recommendationTypesClientValues } from '../../common/src/resources/recommendations/recommendation-types';
import { hl7LabNames } from '../../common/src/resources/hl7/hl7-lab-names';
import { File } from '../../files/src/models/file.entity';
import { TranslatorService } from 'nestjs-translator';
import { UserRoles } from '../../common/src/resources/users';
import { errorsExplanations } from '../../common/src/resources/hl7/errors-explanations';
import { ShopifyService } from '../../shopify/src/shopify.service';

@Injectable()
export class Hl7Service extends BaseService<Hl7Object> {
    constructor(
        @Inject('HL7_OBJECT_MODEL') protected readonly model: Repository<Hl7Object>,
        @Inject('USER_SAMPLE_MODEL') private readonly userSampleModel: Repository<UserSample>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly hl7FilesService: Hl7FilesService,
        private readonly filesService: FilesService,
        private readonly hl7FtpService: Hl7FtpService,
        private readonly adminsResultsService: AdminsResultsService,
        private readonly usersBiomarkersService: UsersBiomarkersService,
        @Inject('HL7_CRITICAL_RANGE_MODEL') private readonly hl7CriticalRangeModel: Repository<Hl7CriticalRange>,
        private readonly mailerService: MailerService,
        private readonly usersService: UsersService,
        @Inject('HL7_FILE_ERROR_MODEL') private readonly hl7FileErrorModel: Repository<Hl7FileError>,
        private readonly hl7ErrorNotificationsService: Hl7ErrorNotificationsService,
        private readonly klaviyoModelService: KlaviyoModelService,
        private readonly klaviyoService: KlaviyoService,
        private readonly translator: TranslatorService,
        private readonly shopifyService: ShopifyService,
    ) { super(model); }

    async generateHl7ObjectsFromSamples(): Promise<void> {
        const scopes: any[] = [
            { method: ['byIsHl7ObjectGenerated', false] },
        ];

        const step = 1000;
        let iterations;

        const userSamplesCount = await this.userSampleModel
            .scope(scopes)
            .count();

        if (userSamplesCount) {
            iterations = Math.ceil(userSamplesCount / step);

            scopes.push(
                { method: ['withUser', ['withAdditionalField']] },
                { method: ['withSample'] }
            );

            await this.dbConnection.transaction(async transaction => {
                for (let i = 0; i < iterations; i++) {
                    const userSamples = await this.userSampleModel
                        .scope(
                            scopes.concat([{ method: ['pagination', { limit: step, offset: i * step }] }])
                        )
                        .findAll({ transaction });

                    const objectsToCreate = userSamples.map(userSample => ({
                        userId: userSample.userId,
                        lab: hl7LabNames[userSample.sample.labName],
                        sampleCode: userSample.sample.sampleId,
                        status: Hl7ObjectStatuses.new,
                        email: userSample.user.email,
                        firstName: userSample.user.firstName,
                        lastName: userSample.user.lastName,
                        dateOfBirth: userSample.user.additionalField.dateOfBirth,
                        sex: userSample.user.additionalField.sex,
                        activatedAt: userSample.createdAt,
                        isQuizCompleted: userSample.user.additionalField.isSelfAssesmentQuizCompleted,
                        userOtherFeature: userSample.userOtherFeature,
                        labId: userSample.sample.labProfileId,
                        testProductName: userSample.sample.productName,
                        orderId: userSample.sample.orderId,
                    }));

                    await this.model.bulkCreate(objectsToCreate, { transaction } as any);

                    await this.userSampleModel
                        .scope({ method: ['byId', userSamples.map(userSample => userSample.id)] })
                        .update({ isHl7ObjectGenerated: true }, { transaction } as any);
                }
            });
        }

        const hl7ObjectsToUploadCount = await this.getCount([{ method: ['byFileId', null] }]);
        iterations = Math.ceil(hl7ObjectsToUploadCount / step);

        for (let i = 0; i < iterations; i++) {
            const hl7ObjectsToUpload = await this.getList([
                { method: ['byFileId', null] },
                { method: ['pagination', { limit: step, offset: i * step }] }
            ]);

            await Promise.all(
                hl7ObjectsToUpload.map(async objectToUpload => {
                    const dataString = this.hl7FilesService.createHl7FileFromHl7Object(objectToUpload);

                    const awsFile = await this.filesService.prepareFile({ contentType: HL7_FILE_TYPE, type: InternalFileTypes.hl7 }, objectToUpload.userId, InternalFileTypes[InternalFileTypes.hl7]);
                    const [createdFile] = await this.filesService.createFilesInDb(objectToUpload.userId, [awsFile]);
                    await objectToUpload.update({ fileId: createdFile.id });

                    await this.filesService.putFileToS3(dataString, awsFile, createdFile);

                    await this.filesService.markFilesAsUsed([createdFile.id]);

                    await this.hl7FtpService.uploadFileToFileServer(
                        FileHelper
                            .getInstance()
                            .buildBaseLink(createdFile),
                        objectToUpload.sampleCode,
                    );
                })
            );
        }
    }

    async checkForStatusFiles(): Promise<void> {
        const fileList = await this.hl7FtpService.getStatusFileList();

        if (!fileList.length) {
            return;
        }

        const step = 1000;
        const iterations = Math.ceil(fileList.length / step);

        for (let i = 0; i < iterations; i++) {
            const slicedList = fileList.slice(i * step, (i + 1) * step);
            const filesMap = {};

            slicedList.forEach(file => {
                const matches = SAMPLE_CODE_FROM_STATUS_FILE.exec(file.name);
                if (matches?.length) {
                    filesMap[matches[2]] = file;
                }
            });

            const sampleCodesArray = Object.keys(filesMap);

            const hl7ObjectList = await this.getList([
                { method: ['bySampleCode', sampleCodesArray] },
                { method: ['byStatus', Hl7ObjectStatuses.new] }
            ]);

            if (!hl7ObjectList.length) {
                continue;
            }

            await Promise.all(
                hl7ObjectList.map(hl7Object => {
                    const matches = SAMPLE_CODE_FROM_STATUS_FILE.exec(filesMap[hl7Object.sampleCode].name);
                    const fileStatusAt = DateTime.fromFormat(matches[1], 'yyyyMMddHHmmss').toISO();
                    return this.loadHl7StatusFile(hl7Object, filesMap[hl7Object.sampleCode].name, fileStatusAt);
                })
            );
        }
    }

    async loadHl7StatusFile(hl7Object: Hl7Object, fileName: string, statusFileAt: string, options: { isReprocess?: boolean } = {}): Promise<void> {
        const awsFile = await this.filesService.prepareFile({ contentType: HL7_FILE_TYPE, type: InternalFileTypes.hl7 }, hl7Object.userId, InternalFileTypes[InternalFileTypes.hl7]);
        const [createdFile] = await this.filesService.createFilesInDb(hl7Object.userId, [awsFile]);

        const data = await this.hl7FtpService.downloadStatusFile(fileName);
        await this.filesService.putFileToS3(data, awsFile, createdFile);

        const response = await axios.get(FileHelper.getInstance().buildBaseLink(createdFile));

        const bodyForUpdate = await this.hl7FilesService.parseHl7FileToHl7Object(response.data);

        await hl7Object.update({
            statusFileId: createdFile.id,
            status: bodyForUpdate.status,
            sampleAt: bodyForUpdate.sampleAt,
            labReceivedAt: bodyForUpdate.labReceivedAt,
            labId: bodyForUpdate.labId,
            statusFileAt
        });

        await this.filesService.markFilesAsUsed([createdFile.id]);

        if (!options.isReprocess) {
            const user = await this.usersService.getOne([
                { method: ['byId', hl7Object.userId] },
                'withAdditionalField'
            ]);

            await this.klaviyoModelService.getKlaviyoProfile(user);
            await this.klaviyoService.sampleReceivedEvent(
                user.email,
                {
                    sampleId: hl7Object.sampleCode,
                    testName: hl7Object.testProductName,
                    labProfileId: hl7Object.labId,
                    activationDate: hl7Object.activatedAt,
                    receivedDate: hl7Object.labReceivedAt
                }
            );
        }
    }

    async checkForResultFiles(): Promise<void> {
        const fileList = await this.hl7FtpService.getResultFileList();

        if (!fileList.length) {
            return;
        }

        const step = 1000;
        const iterations = Math.ceil(fileList.length / step);

        for (let i = 0; i < iterations; i++) {
            const slicedList = fileList.slice(i * step, (i + 1) * step);
            const filesMap = {};

            await Promise.all(
                slicedList.map(async file => {
                    const matches = SAMPLE_CODE_FROM_RESULT_FILE.exec(file.name);
                    if (!matches) {
                        return;
                    }

                    filesMap[matches[2]] = file;

                    const fileDate = DateTime.fromFormat(matches[1], 'yyyyMMddHHmmss');
                    const existingHl7Object = await this.getOne([
                        { method: ['bySampleCode', matches[2]] }
                    ]);

                    const hl7FileError = await this.hl7FileErrorModel
                        .scope([{ method: ['byFileName', file.name] }])
                        .findOne();

                    if (!existingHl7Object && !hl7FileError) {
                        const rawFile = await this.hl7FtpService.downloadResultFile(file.name);
                        const parsedFile = await this.hl7FilesService.parseHl7FileToHl7Object(rawFile.toString());
                        const user = await this.usersService.getOne([{ method: ['byId', parsedFile.userId] }]);
                        let lastHl7Object;
                        if (user) {
                            lastHl7Object = await this.getOne([
                                { method: ['byUserId', user.id] },
                                { method: ['orderBy', [['createdAt', 'desc']]] }
                            ]);
                        }

                        if (lastHl7Object) {
                            await lastHl7Object.update({ status: Hl7ObjectStatuses.error, toFollow: `${INVALID_SAMPLE_ID_ERROR} - ${matches[2]}` });
                            await this.hl7ErrorNotificationsService.create({ message: `${INVALID_SAMPLE_ID_ERROR} - ${matches[2]}`, hl7ObjectId: lastHl7Object.id });
                        } else {
                            const emails = [];
                            if (PROD_ENVS.includes(process.env.NODE_ENV)) {
                                emails.push(SUPER_ADMIN_EMAIL);
                            } else {
                                emails.push(...DEV_ADMIN_EMAILS);
                            }
                            await this.mailerService.sendAdminSampleIdError(
                                emails,
                                {
                                    sampleId: matches[2],
                                    customerId: parsedFile.userId || INVALID_CUSTOMER_ID,
                                    resultAt: fileDate.toISO(),
                                    labName: parsedFile.lab,
                                    rawFile: rawFile.toString()
                                }
                            );
                        }
                        await this.hl7FileErrorModel.create({ fileName: file.name });
                    }

                    if (
                        existingHl7Object
                        && existingHl7Object.status === Hl7ObjectStatuses.verified
                        && !existingHl7Object.toFollow 
                        && !DateTime.fromJSDate(existingHl7Object.resultFileAt).equals(fileDate)
                    ) {
                        await existingHl7Object.update({ status: Hl7ObjectStatuses.error, toFollow: OBJECT_ALREADY_PROCESSED_ERROR });
                        await this.hl7ErrorNotificationsService.create({ message: OBJECT_ALREADY_PROCESSED_ERROR, hl7ObjectId: existingHl7Object.id });
                    }
                })
            );

            const sampleCodesArray = Object.keys(filesMap);

            const hl7ObjectList = await this.getList([
                { method: ['bySampleCode', sampleCodesArray] },
                { method: ['byStatus', Hl7ObjectStatuses.inProgress] }
            ]);

            if (!hl7ObjectList.length) {
                continue;
            }

            await Promise.all(
                hl7ObjectList.map(hl7Object => {
                    const matches = SAMPLE_CODE_FROM_RESULT_FILE.exec(filesMap[hl7Object.sampleCode].name);
                    const resultFileAt = DateTime.fromFormat(matches[1], 'yyyyMMddHHmmss').toISO();
                    return this.loadHl7ResultFile(hl7Object, filesMap[hl7Object.sampleCode].name, resultFileAt);
                })
            );
        }
    }

    async loadHl7ResultFile(hl7Object: Hl7Object, fileName: string, resultFileAt: string, options = { isForce: false }): Promise<void> {
        const awsFile = await this.filesService.prepareFile({ contentType: HL7_FILE_TYPE, type: InternalFileTypes.hl7 }, hl7Object.userId, InternalFileTypes[InternalFileTypes.hl7]);
        const [createdFile] = await this.filesService.createFilesInDb(hl7Object.userId, [awsFile]);

        const data = await this.hl7FtpService.downloadResultFile(fileName);
        await this.filesService.putFileToS3(data, awsFile, createdFile);

        await this.processHl7ResultFile(hl7Object, createdFile, resultFileAt, options);
    }

    async processHl7ResultFile(hl7Object: Hl7Object, resultFile: File, resultFileAt: string, options = { isForce: false }) {
        let isCriticalResult = false, status;

        const response = await axios.get(FileHelper.getInstance().buildBaseLink(resultFile));

        const bodyForUpdate = await this.hl7FilesService.parseHl7FileToHl7Object(response.data);

        status = bodyForUpdate.status;

        await hl7Object.update({
            resultFileId: resultFile.id,
            failedTests: bodyForUpdate.failedTests,
            toFollow: bodyForUpdate.toFollow,
            resultAt: DateTime.utc().toFormat('yyyy-MM-dd'),
            resultFileAt,
            status
        });

        await this.filesService.markFilesAsUsed([resultFile.id]);

        if (bodyForUpdate.results && bodyForUpdate.results.length) {
            const biomarkersList = await this.usersBiomarkersService.getList([
                { method: ['byNameAndAlternativeName', bodyForUpdate.results.map(result => result.biomarkerShortName)] },
                { method: ['byType', BiomarkerTypes.blood] },
                { method: ['withUnit'] },
            ]);

            const resultsToCreate = [];

            await Promise.all(
                bodyForUpdate.results.map(async result => {
                    const biomarker = biomarkersList.find(
                        biomarker => result.biomarkerShortName === biomarker.name
                            || result.biomarkerShortName === biomarker.shortName
                            || biomarker.alternativeNames
                                .map(altName => altName.name)
                                .includes(result.biomarkerShortName)
                    );

                    if (!biomarker) {
                        const errorMessage = `${BIOMARKER_MAPPING_ERROR} ${result.biomarkerShortName} OBX.3`;
                        bodyForUpdate.toFollow = `${errorMessage},\n${bodyForUpdate.toFollow}`;
                        return;
                    }

                    const criticalRange = await this.hl7CriticalRangeModel
                        .scope([{ method: ['byNameAndValue', biomarker.shortName, result.value] }])
                        .findOne();

                    if (criticalRange) {
                        isCriticalResult = true;
                    }

                    if (biomarker.unit.unit !== result.unit) {
                        const errorMessage = `${UNIT_MISMATCH_ERROR} ${result.biomarkerShortName} OBX.6 ${result.unit}`;
                        bodyForUpdate.toFollow = `${errorMessage},\n${bodyForUpdate.toFollow}`;
                    }

                    if (isNaN(result.value)) {
                        return;
                    }

                    resultsToCreate.push({
                        biomarkerId: biomarker.id,
                        value: result.value,
                        date: DateTime.utc().toFormat('yyyy-MM-dd'),
                        unitId: biomarker.unitId,
                        hl7ObjectId: hl7Object.id,
                    });
                })
            );

            if (bodyForUpdate.toFollow) {
                status = options.isForce ? Hl7ObjectStatuses.verified : Hl7ObjectStatuses.error;
                await hl7Object.update({ toFollow: bodyForUpdate.toFollow, status });

                if (!options.isForce) {
                    const errorsCount = bodyForUpdate.toFollow
                        ? bodyForUpdate.toFollow.split('\n').length
                        : 0;

                    await this.hl7ErrorNotificationsService.create({
                        message: bodyForUpdate.toFollow,
                        hl7ObjectId: hl7Object.id,
                        isMultipleError: errorsCount > 1
                    });
                    return;
                }
            }

            if (resultsToCreate.length) {
                await this.adminsResultsService.createUserResults(resultsToCreate, hl7Object.userId, { otherFeature: hl7Object.userOtherFeature });
            }

            const user = await this.usersService.getOne([
                { method: ['byId', hl7Object.userId] },
                'withAdditionalField'
            ]);

            if (!user.additionalField.isUserVerified) {
                await user.additionalField.update({ isUserVerified: true });
                if (user.additionalField.shopifyCustomerId) {
                    await this.shopifyService.updateCustomer(user.additionalField.shopifyCustomerId, user);
                }
            }

            await hl7Object.update({ isCriticalResult });

            const userResults = await this.adminsResultsService.getList([
                { method: ['byUserId', hl7Object.userId] },
                { method: ['withBiomarker'] },
                { method: ['byHl7ObjectId', hl7Object.id] }
            ]);

            await this.klaviyoModelService.getKlaviyoProfile(user);
            await this.klaviyoService.resultsReadyEvent(
                user.email,
                {
                    sampleId: hl7Object.sampleCode,
                    testName: hl7Object.testProductName,
                    labProfileId: hl7Object.labId,
                    activationDate: hl7Object.activatedAt,
                    resultsDate: hl7Object.resultAt,
                    isResultsFailed: !!bodyForUpdate.failedTests,
                    resultsFailedReasons: bodyForUpdate.failedTests 
                        ? bodyForUpdate.failedTests
                            .split(',\n')
                            .map(errorMessage => {
                                const [biomarkerName, errorText] = errorMessage.split(' due to ');
                                return `${biomarkerName} due to ${errorsExplanations[errorText] ? errorsExplanations[errorText] : errorText}`;
                            })
                        : undefined,
                    isCriticalResults: !!userResults.find(userResult =>
                        userResult.recommendationRange === RecommendationTypes.criticalLow
                        || userResult.recommendationRange === RecommendationTypes.criticalHigh
                    ),
                    criticalResults: userResults
                        .filter(userResult =>
                            userResult.recommendationRange === RecommendationTypes.criticalLow
                            || userResult.recommendationRange === RecommendationTypes.criticalHigh
                        )
                        .map(userResult => userResult.biomarker.shortName)
                }
            );

            const badUserResults = userResults.filter(userResult =>
                userResult.recommendationRange !== RecommendationTypes.optimal
            );

            if (badUserResults.length) {
                await this.klaviyoService.badResultsEvent(
                    user.email,
                    {
                        sampleId: hl7Object.sampleCode,
                        testName: hl7Object.testProductName,
                        labProfileId: hl7Object.labId,
                        activationDate: hl7Object.activatedAt,
                        resultsDate: hl7Object.resultAt,
                        badResults: badUserResults.map(userResult => ({
                            biomarkerName: userResult.biomarker.name,
                            range: recommendationTypesClientValues[userResult.recommendationRange]
                        }))
                    }
                );
            }
        }
    }

    async findFileNameForHl7Object(hl7Object: Hl7Object): Promise<{ statusFile: string, resultFile: string }> {
        const statusFileList = await this.hl7FtpService.getStatusFileList();
        const resultFileList = await this.hl7FtpService.getResultFileList();

        const statusFile = statusFileList.find((file) => {
            const matches = SAMPLE_CODE_FROM_STATUS_FILE.exec(file.name);
            if (matches?.length && matches[2] === hl7Object.sampleCode) {
                return true;
            }
            return false;
        });

        const resultFile = resultFileList.find((file) => {
            const matches = SAMPLE_CODE_FROM_RESULT_FILE.exec(file.name);
            if (matches?.length && matches[2] === hl7Object.sampleCode) {
                return true;
            }
            return false;
        });

        return { statusFile: statusFile && statusFile.name, resultFile: resultFile && resultFile.name };
    }

    async checkForPdfResultsFiles(): Promise<void> {
        const fileList = await this.hl7FtpService.getPdfResultsFileList();

        if (!fileList.length) {
            return;
        }

        const step = 1000;
        const iterations = Math.ceil(fileList.length / step);

        for (let i = 0; i < iterations; i++) {
            const slicedList = fileList.slice(i * step, (i + 1) * step);
            const filesMap = {};

            slicedList.forEach(file => {
                const matches = SAMPLE_CODE_FROM_PDF_RESULT_FILE.exec(file.name);
                if (matches?.length) {
                    filesMap[matches[1]] = file;

                    console.log(matches[1]);
                }
                console.log(file.name);
            });

            const sampleCodesArray = Object.keys(filesMap);

            const hl7ObjectList = await this.getList([
                { method: ['bySampleCode', sampleCodesArray] },
                { method: ['byPdfResultFileId', null] }
            ]);

            if (!hl7ObjectList.length) {
                continue;
            }

            await Promise.all(
                hl7ObjectList.map(hl7Object => {
                    const matches = SAMPLE_CODE_FROM_PDF_RESULT_FILE.exec(filesMap[hl7Object.sampleCode].name);
                    const pdfResultAt = DateTime.fromFormat(matches[2], 'yyyyMMddHHmmss').toISO();
                    return this.loadPdfResultFile(hl7Object, filesMap[hl7Object.sampleCode].name, pdfResultAt);
                })
            );
        }
    }

    async loadPdfResultFile(hl7Object: Hl7Object, fileName: string, pdfResultFileAt: string): Promise<void> {
        const awsFile = await this.filesService.prepareFile({ contentType: PDF_CONTENT_TYPE, type: InternalFileTypes.hl7 }, hl7Object.userId, InternalFileTypes[InternalFileTypes.hl7]);
        const [createdFile] = await this.filesService.createFilesInDb(hl7Object.userId, [awsFile]);

        const data = await this.hl7FtpService.downloadPdfResultsFile(fileName);
        await this.filesService.putFileToS3(data, awsFile, createdFile);

        await hl7Object.update({
            pdfResultFileId: createdFile.id,
            pdfResultFileAt
        });

        await this.filesService.markFilesAsUsed([createdFile.id]);
    }

    async processHl7FileByFile(resultFile: File): Promise<Hl7Object> {
        const response = await axios.get(FileHelper.getInstance().buildBaseLink(resultFile));

        const parsedData = await this.hl7FilesService.parseHl7FileToHl7Object(response.data);

        if (!parsedData.userId) {
            throw new NotFoundException({
                message: this.translator.translate('USER_FIELD_INVALID_IN_FILE'),
                errorCode: 'USER_FIELD_INVALID_IN_FILE',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        if (!parsedData.sampleCode) {
            throw new NotFoundException({
                message: this.translator.translate('SAMPLE_CODE_FIELD_INVALID_IN_FILE'),
                errorCode: 'SAMPLE_CODE_FIELD_INVALID_IN_FILE',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const user = await this.usersService.getOne([
            { method: ['byId', parsedData.userId] },
            { method: ['byRoles', UserRoles.user] }
        ]);

        if (!user) {
            throw new NotFoundException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const hl7Object = await this.getOne([
            { method: ['bySampleCode', parsedData.sampleCode] },
            { method: ['byUserId', user.id] }
        ]);

        if (!hl7Object) {
            throw new NotFoundException({
                message: this.translator.translate('HL7_OBJECT_NOT_FOUND'),
                errorCode: 'HL7_OBJECT_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        if (hl7Object.status !== Hl7ObjectStatuses.error) {
            throw new NotFoundException({
                message: this.translator.translate('HL7_OBJECT_NOT_ERROR_STATUS'),
                errorCode: 'HL7_OBJECT_NOT_ERROR_STATUS',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await hl7Object.update({
            resultFileId: resultFile.id,
            resultFileAt: hl7Object.resultFileAt
                ? undefined
                : DateTime.fromJSDate(resultFile.createdAt).toISO()
        });

        return hl7Object;
    }
}
