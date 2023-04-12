import { ApiProperty } from '@nestjs/swagger';
import { Recommendation } from '../../../biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationDto } from '../../../biomarkers/src/models/recommendations/recommendation.dto';
import { BaseFilterRecommendationDto } from '../../../biomarkers/src/models/recommendations/base-filter-recommendation.dto';


export class RecommendationWithFilterDto extends RecommendationDto {
    constructor(entity: Recommendation) {
        super(entity);
        this.filterRecommendation = entity.filterRecommendation
            ? new BaseFilterRecommendationDto(entity.filterRecommendation)
            : undefined;
    }

    @ApiProperty({ type: () => BaseFilterRecommendationDto, required: false })
    readonly filterRecommendation: BaseFilterRecommendationDto;
}