import { ApiProperty } from '@nestjs/swagger';
import { FileTypes } from '../../../common/src/resources/files/file-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { ConfigService } from '../../../common/src/utils/config/config.service';
import { File } from './file.entity';
import { FILE_TYPES } from 'apps/common/src/resources/files/files-validation-rules';

export class FileDto {
    constructor(file: File, configService: ConfigService) {
        this.id = file.id;
        this.userId = file.userId;
        this.link = this.buildLink(file, configService);
        this.name = file.name;
        this.fileKey = file.fileKey;
        this.type = file.type;
        this.isUsed = file.isUsed;
        this.status = file.status;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => String, required: false })
    readonly link: string;

    @ApiProperty({ type: () => String, required: false })
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    readonly fileKey: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(FileTypes) })
    readonly type: number;

    @ApiProperty({ type: () => Boolean, required: false })
    readonly isUsed: boolean;

    @ApiProperty({ type: String, enum: FILE_TYPES, required: false })
    readonly contentType: string;

    @ApiProperty({ type: () => Number, enum: FileStatuses, required: false })
    readonly status: number;

    buildLink(file: File, configService: ConfigService) {
        if (!file) {
            return null;
        }
        const fileKey = file.fileKey;
        const domain = configService.get('AWS_S3_DOMAIN');
        const bucket = configService.get('AWS_S3_BUCKET');

        return `${domain}/${bucket}/${fileKey}`;
    }
}
