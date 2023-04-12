import { ApiProperty } from '@nestjs/swagger';
import { Recommendation } from '../../../biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationWithFilterDto } from './recommendation-with-filter.dto';

export class RecommendationsWithoutPaginationDto {
    @ApiProperty({ type: () => [RecommendationWithFilterDto] })
    readonly data: RecommendationWithFilterDto[];

    constructor(recommendations: Recommendation[]) {
        this.data = recommendations.map(recommendation => new RecommendationWithFilterDto(recommendation));
    }
}
