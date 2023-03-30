import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/src/models/pagination.dto';
import { RecommendationTag } from './recommendation-tag.entity';

export class TagNamesListDto {
    @ApiProperty({ type: () => [String] })
    readonly data: string[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(tags: RecommendationTag[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = tags.map(tag => tag.get('name'));
    }
}