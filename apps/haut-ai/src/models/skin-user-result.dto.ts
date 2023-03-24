import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { SkinUserResultStatuses } from 'apps/common/src/resources/haut-ai/skin-user-result-statuses';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { FileDto } from 'apps/files/src/models/file.dto';
import { SkinUserResult } from './skin-user-result.entity';

export class SkinUserResultDto extends BaseDto<SkinUserResult> {
    constructor(entity: SkinUserResult) {
        super(entity);

        this.userHautAiFieldId = entity.userHautAiFieldId;
        this.hautAiBatchId = entity.hautAiBatchId;
        this.hautAiFileId = entity.hautAiFileId;
        this.itaScore = entity.itaScore;
        this.status = entity.status;
        this.fileId = entity.fileId;
        this.perceivedAge = entity.perceivedAge;
        this.eyesAge = entity.eyesAge;
        this.file = entity.file
            ? new FileDto(entity.file)
            : undefined;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userHautAiFieldId: number;

    @ApiProperty({ type: () => String, required: false })
    readonly hautAiBatchId: string;

    @ApiProperty({ type: () => String, required: false })
    readonly hautAiFileId: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly itaScore: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(SkinUserResultStatuses) })
    readonly status: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly fileId: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly perceivedAge: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly eyesAge: number;

    @ApiProperty({ type: () => FileDto, required: false })
    readonly file: FileDto;
}