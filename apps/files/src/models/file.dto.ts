import { ApiProperty } from '@nestjs/swagger';
import { FileTypes } from '../../../common/src/resources/files/file-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { File } from './file.entity';
import { FileStatuses } from '../../../common/src/resources/files/file-statuses';
import { FileHelper } from 'apps/common/src/utils/helpers/file.helper';
import { BaseDto } from 'apps/common/src/base/base.dto';

export class FileDto extends BaseDto<File> {
    constructor(file: File) {
        super(file);

        this.userId = file.userId;
        this.link = FileHelper
            .getInstance()
            .buildBaseLink(file);
        this.name = file.name;
        this.fileKey = file.fileKey;
        this.type = file.type;
        this.isUsed = file.isUsed;
        this.status = file.status;
        this.bytes = file.bytes;
    }

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

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(FileStatuses) })
    readonly status: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly bytes: number;
}
