import { HttpStatus, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Repository } from 'sequelize-typescript';
import { File } from './models/file.entity';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { createPresignedPost as s3CreatePresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { FileStatuses } from '../../common/src/resources/files/file-statuses';
import { IAwsCopyFile } from './files.service';
import { SessionDataDto } from '../../sessions/src/models';
import { Transaction } from 'sequelize';

@Injectable()
export class S3Service {
    readonly bucket: string;
    readonly s3Connection: S3;

    constructor(
        @Inject('FILE_MODEL') private fileModel: Repository<File>,
        readonly configService: ConfigService
    ) {
        this.bucket = configService.get('AWS_S3_BUCKET');
        this.s3Connection = new S3({
            region: configService.get('AWS_S3_REGION'),
            credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
            }
        });
    }

    createPresignedPost(key: string, contentType: string, acl: string): Promise<PresignedPost> {
        const params = {
            Bucket: this.bucket,
            Conditions: [
                { acl },
                { 'Content-Type': contentType }
            ],
            Key: key
        };


        return s3CreatePresignedPost(this.s3Connection, params);
    }

    async markFileAsUploaded(file: File, transaction?: Transaction): Promise<void> {
        if (file.status !== FileStatuses.loaded) {
            const { bucket } = this;
            const headObject = await this.s3Connection.headObject({ Key: `${file.fileKey}`, Bucket: bucket });

            await this.fileModel
                .scope([{ method: ['byId', file.id] }])
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                .update({ status: FileStatuses.loaded, bytes: headObject.ContentLength }, { transaction });
        }
    }

    async copyFiles(files: IAwsCopyFile[], user: SessionDataDto, transaction?: Transaction): Promise<File[]> {
        const copiedFiles = await Promise.all(
            files.map(async (file) => {
                const params = {
                    Bucket: this.bucket,
                    CopySource: `${this.bucket}/${file.copySourceKey}`,
                    Key: file.key,
                    ACL: 'public-read',
                };

                await this.s3Connection.copyObject(params);

                return {
                    userId: user.userId,
                    name: `${file.fileName}.${file.extension}`,
                    fileKey: file.key,
                    status: FileStatuses.pending,
                    type: file.type,
                    isUsed: false,
                    isResized: false,
                };
            })
        );

        return await this.fileModel.bulkCreate(copiedFiles, { transaction });
    }

    async putObject(body: any, key: string, contentType: string, acl: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ACL: acl,
            ContentType: contentType
        });

        try {
            const response = await this.s3Connection.send(command);
            console.log(response);
        } catch (err) {
            console.error(err.message);
            throw new UnprocessableEntityException({
                message: err.message,
                errorCode: 'S3_FILE_UPLOAD_ERROR',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }
}
