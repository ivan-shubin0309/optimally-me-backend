import { BadRequestException, ForbiddenException, HttpStatus, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { FileStatuses } from '../../common/src/resources/files/file-statuses';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { File } from './models/file.entity';
import { FileTypes } from '../../common/src/resources/files/file-types';
import { Transaction } from 'sequelize/types';
import { TranslatorService } from 'nestjs-translator';
import { S3Service } from './s3.service';
import { SessionDataDto } from '../../sessions/src/models';
import { FilesContentTypesDto } from './models/files-content-types.dto';
import { rules } from '../../common/src/resources/files/files-validation-rules';
import { UserRoles } from '../../common/src/resources/users';
import * as uuid from 'uuid';

interface IAwsFile {
    acl?: string,
    fileName?: string,
    key?: string,
    contentType: string,
    type: number,
}

@Injectable()
export class FilesService extends BaseService<File> {
    constructor(
        @Inject('FILE_MODEL') protected model: Repository<File>,
        readonly translator: TranslatorService,
        readonly s3Service: S3Service,
    ) { super(model); }

    createFilesInDb(userId: number, files: IAwsFile[]): Promise<File[]> {
        const filesForSave = files.map(file => ({
            userId,
            name: file.fileName,
            fileKey: file.key,
            status: FileStatuses.pending,
            type: file.type,
            isUsed: false
        }));
        return this.model.bulkCreate(filesForSave);
    }

    async checkCanUse(fileId: number, type: FileTypes, transaction?: Transaction, isUsed = true): Promise<void> {
        const scopes = [
            { method: ['byId', fileId] },
            { method: ['byType', type] }
        ];

        const file = await this.getOne(scopes, transaction);
        if (!file) {
            throw new NotFoundException({
                message: this.translator.translate('FILE_NOT_FOUND'),
                errorCode: 'FILE_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        if (file.isUsed && isUsed) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('FILE_IS_USED'),
                errorCode: 'FILE_IS_USED',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        try {
            await this.s3Service.markFileAsUploaded(file, transaction);
        } catch (error) {
            throw new BadRequestException({
                message: this.translator.translate('FILE_NOT_FOUND'),
                errorCode: 'FILE_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
    }

    prepareFiles(body: FilesContentTypesDto, user: SessionDataDto): IAwsFile[] {
        return body.files.map(file => {
            let extension = '';
            const fileToCreate: IAwsFile = Object.assign({}, file);

            if (!rules.supportedTypes[file.type].includes(file.contentType)) {
                throw new ForbiddenException({
                    message: this.translator.translate('INVALID_FILE_TYPE'),
                    errorCode: 'INVALID_FILE_TYPE',
                    statusCode: HttpStatus.FORBIDDEN
                });
            }

            Object
                .keys(rules.filesContentTypes)
                .forEach(contentType => {
                    if (rules.filesContentTypes[contentType].contentTypes.includes(file.contentType)) {
                        extension = rules.filesContentTypes[contentType].extension;
                    }
                });

            fileToCreate.acl = 'public-read';
            fileToCreate.fileName = `optimallyme_${uuid.v4()}.${extension}`;
            fileToCreate.key = `files/admins/${fileToCreate.fileName}`;
            if (user.role !== UserRoles.admin) {
                fileToCreate.key = `files/user_${user.userId}/${fileToCreate.fileName}`;
            }

            return fileToCreate;
        });
    }

    update(scopes: any[], body: { status: FileStatuses }, transaction?: Transaction): Promise<[affectedCount: number, affectedRows: File[]]> {
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return this.model.scope(scopes).update(body, { transaction });
    }
}
