import { Inject, Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Hl7Object } from './models/hl7-object.entity';
import { UserSample } from '../../samples/src/models/user-sample.entity';
import { Hl7ObjectStatuses } from '../../common/src/resources/hl7/hl7-object-statuses';
import { Hl7FilesService } from './hl7-files.service';
import { FilesService } from '../../files/src/files.service';
import { InternalFileTypes } from '../../common/src/resources/files/file-types';
import { HL7_FILE_TYPE } from '../../common/src/resources/files/files-validation-rules';
import { Hl7FtpService } from './hl7-ftp.service';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { BIOMARKER_MAPPING_ERROR, OBX_FIELDS_NUMBER_ERROR, OBX_MIN_FIELDS_NUMBER, SAMPLE_CODE_FROM_RESULT_FILE, SAMPLE_CODE_FROM_STATUS_FILE, UNIT_MISMATCH_ERROR } from '../../common/src/resources/hl7/hl7-constants';
import axios from 'axios';
import { DateTime } from 'luxon';
import { AdminsResultsService } from '../../admins-results/src/admins-results.service';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { Hl7CriticalRange } from './models/hl7-critical-range.entity';

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
        @Inject('HL7_CRITICAL_RANGE_MODEL') private readonly hl7CriticalRangeModel: Repository<Hl7CriticalRange>
    ) { super(model); }

    async generateHl7ObjectsFromSamples(): Promise<void> {
        const scopes: any[] = [
            { method: ['byIsHl7ObjectGenerated', false] },
        ];

        const userSamplesCount = await this.userSampleModel
            .scope(scopes)
            .count();

        if (!userSamplesCount) {
            return;
        }

        scopes.push(
            { method: ['withUser', ['withAdditionalField']] },
            { method: ['withSample'] }
        );

        const step = 1000;
        let iterations = Math.ceil(userSamplesCount / step);

        await this.dbConnection.transaction(async transaction => {
            for (let i = 0; i < iterations; i++) {
                const userSamples = await this.userSampleModel
                    .scope(
                        scopes.concat([{ method: ['pagination', { limit: step, offset: i * step }] }])
                    )
                    .findAll({ transaction });

                const objectsToCreate = userSamples.map(userSample => ({
                    userId: userSample.userId,
                    lab: 'County_Pathology',
                    sampleCode: userSample.sample.sampleId,
                    status: Hl7ObjectStatuses.new,
                    email: userSample.user.email,
                    firstName: userSample.user.firstName,
                    lastName: userSample.user.lastName,
                    dateOfBirth: userSample.user.additionalField.dateOfBirth,
                    sex: userSample.user.additionalField.sex,
                    activatedAt: userSample.createdAt,
                    isQuizCompleted: userSample.user.additionalField.isSelfAssesmentQuizCompleted,
                }));

                await this.model.bulkCreate(objectsToCreate, { transaction } as any);

                await this.userSampleModel
                    .scope({ method: ['byId', userSamples.map(userSample => userSample.id)] })
                    .update({ isHl7ObjectGenerated: true }, { transaction } as any);
            }
        });

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

    async loadHl7StatusFile(hl7Object: Hl7Object, fileName: string, statusFileAt: string): Promise<void> {
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

            slicedList.forEach(file => {
                const matches = SAMPLE_CODE_FROM_RESULT_FILE.exec(file.name);
                if (matches?.length) {
                    filesMap[matches[2]] = file;
                }
            });

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

    async loadHl7ResultFile(hl7Object: Hl7Object, fileName: string, resultFileAt: string): Promise<void> {
        let isCriticalResult = false, status;

        const awsFile = await this.filesService.prepareFile({ contentType: HL7_FILE_TYPE, type: InternalFileTypes.hl7 }, hl7Object.userId, InternalFileTypes[InternalFileTypes.hl7]);
        const [createdFile] = await this.filesService.createFilesInDb(hl7Object.userId, [awsFile]);

        const data = await this.hl7FtpService.downloadResultFile(fileName);
        await this.filesService.putFileToS3(data, awsFile, createdFile);

        const response = await axios.get(FileHelper.getInstance().buildBaseLink(createdFile));

        const bodyForUpdate = await this.hl7FilesService.parseHl7FileToHl7Object(response.data);

        status = bodyForUpdate.status;

        if (bodyForUpdate.results.length < OBX_MIN_FIELDS_NUMBER) {
            bodyForUpdate.toFollow = `${OBX_FIELDS_NUMBER_ERROR},\n${bodyForUpdate.toFollow}`;
        }

        await hl7Object.update({
            resultFileId: createdFile.id,
            status,
            failedTests: bodyForUpdate.failedTests,
            toFollow: bodyForUpdate.toFollow,
            resultAt: DateTime.utc().toFormat('yyyy-MM-dd'),
            resultFileAt
        });

        await this.filesService.markFilesAsUsed([createdFile.id]);

        if (bodyForUpdate.results.length < OBX_MIN_FIELDS_NUMBER) {
            return;
        }

        if (bodyForUpdate.results && bodyForUpdate.results.length) {
            const biomarkersList = await this.usersBiomarkersService.getList([
                { method: ['byNameAndAlternativeName', bodyForUpdate.results.map(result => result.biomarkerShortName)] },
                { method: ['byType', BiomarkerTypes.blood] },
                { method: ['withUnit'] },
            ]);

            const resultsToCreate = [];
            const biomarkerIds = [];

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
                        bodyForUpdate.toFollow = `${BIOMARKER_MAPPING_ERROR} ${result.biomarkerShortName} OBX.3,\n${bodyForUpdate.toFollow}`;
                        return;
                    }

                    const criticalRange = await this.hl7CriticalRangeModel
                        .scope([{ method: ['byNameAndValue', biomarker.shortName, result.value] }])
                        .findOne();

                    if (criticalRange) {
                        isCriticalResult = true;
                    }

                    if (biomarker.unit.unit !== result.unit) {
                        bodyForUpdate.toFollow = `${UNIT_MISMATCH_ERROR} ${result.biomarkerShortName} OBX.6 ${result.unit},\n${bodyForUpdate.toFollow}`;
                    }

                    biomarkerIds.push(biomarker.id);

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
                status = Hl7ObjectStatuses.error;
            }

            await this.adminsResultsService.createUserResults(resultsToCreate, hl7Object.userId, biomarkerIds);

            await hl7Object.update({ isCriticalResult, toFollow: bodyForUpdate.toFollow });
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
}
