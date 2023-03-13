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

@Injectable()
export class Hl7Service extends BaseService<Hl7Object> {
    constructor(
        @Inject('HL7_OBJECT_MODEL') protected readonly model: Repository<Hl7Object>,
        @Inject('USER_SAMPLE_MODEL') private readonly userSampleModel: Repository<UserSample>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly hl7FilesService: Hl7FilesService,
        private readonly filesService: FilesService,
        private readonly hl7FtpService: Hl7FtpService,
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
                    lab: null,
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

                    await this.hl7FtpService.uploadFileToFileServer(); //TO DO
                })
            );
        }
    }
}
