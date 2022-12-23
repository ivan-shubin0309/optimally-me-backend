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
import { connection, IUtf8Message } from 'websocket';

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

    getHautAiUser(): Promise<{ accessToken: string, userId: number }> {
        return this.hautAiService.getHautAiUser();
    }

    async uploadPhotoToHautAi(file: File, subjectId: string, hautAiUser: { accessToken: string, userId: number }): Promise<any> {
        const batchId = await this.hautAiService.createBatch(hautAiUser.accessToken, this.configService.get('HAUT_AI_DATASET_ID'), subjectId);

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
        const fileBuffer = Buffer.from(response.data, 'utf-8');

        await new Promise((resolve, reject) => {
            this.hautAiService.subscribeToNotifications(
                hautAiUser.accessToken,
                hautAiUser.userId,
                (data: IUtf8Message, connection: connection) => {
                    console.log(data);
                    const body = JSON.parse(data.utf8Data);
                    if (body.meta.batch_id === batchId) {
                        //connection.close();
                        resolve(body);
                    }
                }
            );
        }).catch(error => {
            throw new UnprocessableEntityException({
                message: error.message,
                errorCode: 'HAUT_AI_WEBSOCKET_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        });

        const uploadedFileId = await this.hautAiService.uploadPhotoToBatch(hautAiUser.accessToken, this.configService.get('HAUT_AI_DATASET_ID'), subjectId, batchId, fileBuffer, { name: file.name });

        return this.hautAiService.getImageResults(hautAiUser.accessToken, this.configService.get('HAUT_AI_DATASET_ID'), subjectId, batchId, uploadedFileId);
    }
}