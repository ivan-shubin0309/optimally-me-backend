import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { SkinUserResultDto } from './skin-user-result.dto';
import { SkinUserResult } from './skin-user-result.entity';

export class SkinResultListDto {
    @ApiProperty({ type: () => [SkinUserResultDto] })
    readonly data: SkinUserResultDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(skinUserResults: SkinUserResult[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = skinUserResults.map(skinUserResult => new SkinUserResultDto(skinUserResult));
    }
}