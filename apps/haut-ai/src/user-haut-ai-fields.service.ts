import { HttpStatus, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserHautAiField } from './models/user-haut-ai-field.entity';
import { Transaction } from 'sequelize/types';
import { HautAiService } from './haut-ai.service';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { SubjectInDto } from './models/subject-in.dto';
import { File } from '../../files/src/models/file.entity';
import axios from 'axios';
import { FileHelper } from '../../common/src/utils/helpers/file.helper';
import { HautAiUploadedPhotoDto } from './models/haut-ai-uploaded-photo.dto';

@Injectable()
export class UserHautAiFieldsService extends BaseService<UserHautAiField> {
    constructor(
        @Inject('USER_HAUT_AI_FIELD_MODEL') protected model: Repository<UserHautAiField>,
        private readonly hautAiService: HautAiService,
        private readonly configService: ConfigService,
    ) { super(model); }

    async create(userId: number, transaction?: Transaction): Promise<UserHautAiField> {
        return this.model.create({ userId }, { transaction });
    }

    async createSubject(userId: number, accessToken: string, data: SubjectInDto, transaction?: Transaction): Promise<string> {
        const subjectId = await this.hautAiService.createSubject(accessToken, this.configService.get('HAUT_AI_DATASET_ID'), data);
        await this.model
            .scope([{ method: ['byUserId', userId] }])
            .update({ hautAiSubjectId: subjectId }, { transaction } as any);

        return subjectId;
    }

    getAccessToken(): string {
        return this.hautAiService.getAccessToken();
    }

    async uploadPhotoToHautAi(file: File, subjectId: string, accessToken: string): Promise<HautAiUploadedPhotoDto> {
        console.log('Creating batch');
        const batchId = await this.hautAiService.createBatch(accessToken, this.configService.get('HAUT_AI_DATASET_ID'), subjectId);
        console.log(`Batch created id ${batchId}`);

        console.log('Getting file from S3');
        const response = await axios
            .get(
                FileHelper
                    .getInstance()
                    .buildBaseLink(file),
                { responseType: 'arraybuffer' }
            )
            .catch((error) => {
                throw new UnprocessableEntityException({
                    message: error.message,
                    errorCode: 'HAUT_AI_REQUEST_ERROR',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                });
            });

        console.log('Uploading file to haut ai');
        const uploadedFileId = await this.hautAiService.uploadPhotoToBatch(accessToken, this.configService.get('HAUT_AI_DATASET_ID'), subjectId, batchId, response.data, { name: file.name });
        console.log('File uploaded');

        return {
            subjectId,
            batchId,
            uploadedFileId
        };
    }

    async getImageResults(accessToken: string, subjectId: string, batchId: string, imageId: string) {
        return this.hautAiService.getImageResults(accessToken, this.configService.get('HAUT_AI_DATASET_ID'), subjectId, batchId, imageId);
    }
}