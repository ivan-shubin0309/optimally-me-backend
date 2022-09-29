import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/src/models/pagination.dto';
import { RecommendationDto } from './recommendation.dto';
import { Recommendation } from './recommendation.entity';

export class RecommendationsDto {
    @ApiProperty({ type: () => [RecommendationDto] })
    readonly data: RecommendationDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(recommendations: Recommendation[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = recommendations.map(recommendation => new RecommendationDto(recommendation));
    }
}
