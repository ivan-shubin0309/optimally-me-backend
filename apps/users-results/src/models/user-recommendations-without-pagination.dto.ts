import { ApiProperty } from '@nestjs/swagger';
import { Recommendation } from '../../../biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationDto } from '../../../biomarkers/src/models/recommendations/recommendation.dto';

export class RecommendationsWithoutPaginationDto {
    @ApiProperty({ type: () => [RecommendationDto] })
    readonly data: RecommendationDto[];

    constructor(recommendations: Recommendation[]) {
        this.data = recommendations.map(recommendation => new RecommendationDto(recommendation));
    }
}
