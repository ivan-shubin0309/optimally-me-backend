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
import { adminRoles } from '../../common/src/resources/users';
import * as uuid from 'uuid';
import { FILE_PREFIX } from '../../common/src/resources/files/constants';

interface IAwsFile {
    acl?: string,
    fileName?: string,
    key?: string,
    contentType?: string,
    type: number,
}

export interface IAwsCopyFile extends IAwsFile {
    copySourceKey: string,
    extension: string,
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

    async checkCanUse(fileId: number, type: FileTypes, transaction?: Transaction, isUsed = true): Promise<File> {
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
            throw new UnprocessableEntityException({
                message: this.translator.translate('FILE_NOT_FOUND_ON_S3'),
                errorCode: 'FILE_NOT_FOUND_ON_S3',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        return file;
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
            fileToCreate.fileName = `${FILE_PREFIX}_${uuid.v4()}.${extension}`;
            fileToCreate.key = `files/user_${user.userId}/${fileToCreate.fileName}`;
            if (adminRoles.includes(user.role)) {
                fileToCreate.key = `files/admins/${fileToCreate.fileName}`;
            }

            return fileToCreate;
        });
    }

    update(scopes: any[], body: { status: FileStatuses }, transaction?: Transaction): Promise<[affectedCount: number, affectedRows: File[]]> {
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return this.model.scope(scopes).update(body, { transaction });
    }

    prepareFilesForCopy(files: File[], user: SessionDataDto): IAwsCopyFile[] {
        let pathToFiles = `files/user_${user.userId}/`;
        if (adminRoles.includes(user.role)) {
            pathToFiles = 'files/admins/';
        }

        return files.map((file) => {
            const extension = file.name.split('.')[1];
            const copiedFileName = `${FILE_PREFIX}_${uuid.v4()}`;
            const copiedFileKey = `${pathToFiles}${copiedFileName}.${extension}`;

            return {
                extension,
                fileName: copiedFileName,
                key: copiedFileKey,
                acl: 'public-read',
                type: file.type,
                copySourceKey: file.fileKey,
            };
        });
    }

    async duplicateFiles(fileIds: number[], user: SessionDataDto, transaction?: Transaction): Promise<File[]> {
        const fileInstances = await this.model
            .scope([
                { method: ['byId', fileIds] },
                { method: ['orderByLiteral', 'id', fileIds, 'asc'] }
            ])
            .findAll({ transaction });

        if (fileInstances.length === 0) {
            return fileInstances;
        }

        const filesData = this.prepareFilesForCopy(fileInstances, user);

        let copiedFiles;

        try {
            copiedFiles = await this.s3Service.copyFiles(filesData, user, transaction);
        } catch (err) {
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'S3_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        return copiedFiles;
    }

    async markFilesAsUsed(fileIds: number[], transaction?: Transaction): Promise<void> {
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        await this.model.scope([{ method: ['byId', fileIds] }]).update({ isUsed: true }, { transaction });
    }

    async markFilesAsUploaded(files: File[]): Promise<void> {
        try {
            await Promise.all(
                files.map(file => this.s3Service.markFileAsUploaded(file))
            );
        } catch (error) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('FILE_NOT_FOUND_ON_S3'),
                errorCode: 'FILE_NOT_FOUND_ON_S3',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
    }
}
