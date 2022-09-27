import { ApiProperty } from '@nestjs/swagger';
import { RecommendationDto } from './recommendation.dto';
import { Recommendation } from './recommendation.entity';
import { PaginationDto } from '../../../../common/src/models/pagination.dto';

export class ListRecommendationsDto {
    @ApiProperty({ type: () => [RecommendationDto] })
    readonly recommendations: RecommendationDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(recommendations: Recommendation[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.recommendations = recommendations.map(recommendation => new RecommendationDto(recommendation));
    }
}