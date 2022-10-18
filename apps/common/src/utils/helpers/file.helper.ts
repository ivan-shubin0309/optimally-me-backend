import { File } from '../../../../files/src/models/file.entity';
import { ConfigService } from '../config/config.service';

export class FileHelper {
    static buildBaseLink(configService: ConfigService, file: File): string {
        return `${configService.get('AWS_S3_DOMAIN')}/${configService.get('AWS_S3_BUCKET')}/${file.fileKey}`;
    }

    static setBaseLink(configService: ConfigService, file: File): void {
        const link = FileHelper.buildBaseLink(configService, file);
        file.link = link;
        file.setDataValue('link', link);
    }
}