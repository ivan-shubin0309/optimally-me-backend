import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterRecommendationDto } from './base-filter-recommendation.dto';
import { FilterRecommendation } from './filter-recommendation.entity';
import { RecommendationDto } from './recommendation.dto';


export class FilterRecommendationDto extends BaseFilterRecommendationDto {
    constructor(entity: FilterRecommendation) {
        super(entity);
        this.recommendation = entity.recommendation && new RecommendationDto(entity.recommendation);
    }

    @ApiProperty({ type: () => RecommendationDto, required: true })
    recommendation: RecommendationDto;
}