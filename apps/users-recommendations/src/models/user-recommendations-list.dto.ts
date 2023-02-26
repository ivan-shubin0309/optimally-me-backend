import { ApiProperty } from '@nestjs/swagger';
import { Recommendation } from 'apps/biomarkers/src/models/recommendations/recommendation.entity';
import { PaginationDto } from 'apps/common/src/models/pagination.dto';
import { RecommendationForUserListDto } from './recommendation-for-list.dto';

export class UserRecommendationsListDto {
    @ApiProperty({ type: () => [RecommendationForUserListDto] })
    readonly data: RecommendationForUserListDto[];
    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(recommendations: Recommendation[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = recommendations.map(recommendation => new RecommendationForUserListDto(recommendation));
    }
}
