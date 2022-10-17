import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Repository } from 'sequelize-typescript';
import { File } from './models/file.entity';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createPresignedPost as s3CreatePresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { Transaction } from 'sequelize/types';
import { FileStatuses } from '../../common/src/resources/files/file-statuses';

@Injectable()
export default class S3Service {
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
            await this.s3Connection.headObject({ Key: `${file.fileKey}`, Bucket: bucket });

            await this.fileModel.update({ status: FileStatuses.loaded }, { where: { id: file.id }, transaction });
        }
    }

    async uploadFileToS3(data, fileKey, contentType, contentEncoding): Promise<Upload> {
        const { bucket } = this;

        return new Upload({
            client: this.s3Connection,
            params: {
                Bucket: bucket,
                Key: fileKey,
                Body: data,
                ACL: 'public-read',
                ContentEncoding: contentType,
                ContentType: contentEncoding,
            }
        });
    }
}
