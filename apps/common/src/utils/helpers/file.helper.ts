import { Injectable } from '@nestjs/common';
import { File } from '../../../../files/src/models/file.entity';
import { ConfigService } from '../config/config.service';

@Injectable()
export class FileHelper {
    private static instance: FileHelper;

    constructor(
        private readonly configService: ConfigService
    ) {
        FileHelper.instance = this;
    }

    public static getInstance(): FileHelper {
        return FileHelper.instance;
    }

    buildBaseLink(file: File): string {
        return `${this.configService.get('AWS_S3_DOMAIN')}/${file.fileKey}`;
    }
}