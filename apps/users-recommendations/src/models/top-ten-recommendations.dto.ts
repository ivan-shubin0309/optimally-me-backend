import { ApiProperty } from '@nestjs/swagger';
import { Recommendation } from 'apps/biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationForUserListDto } from './recommendation-for-list.dto';

export class TopTenRecommendationsDto {
    @ApiProperty({ type: () => [RecommendationForUserListDto] })
    readonly data: RecommendationForUserListDto[];

    constructor(recommendations: Recommendation[]) {
        this.data = recommendations.map(recommendation => new RecommendationForUserListDto(recommendation));
    }
}
