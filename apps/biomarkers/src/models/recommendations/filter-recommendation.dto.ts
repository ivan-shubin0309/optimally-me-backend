import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';
import { FilterRecommendation } from './filter-recommendation.entity';
import { RecommendationDto } from './recommendation.dto';


export class FilterRecommendationDto extends BaseDto<FilterRecommendation>{
    constructor(entity: FilterRecommendation) {
        super(entity);
        this.filterId = entity.filterId;
        this.recommendationId = entity.recommendationId;
        this.order = entity.order;
        this.recommendation = entity.recommendation && new RecommendationDto(entity.recommendation);
    }

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;

    @ApiProperty({ type: () => Number, required: true })
    recommendationId: number;

    @ApiProperty({ type: () => Number, required: true })
    order: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationTypes) })
    type: number;

    @ApiProperty({ type: () => RecommendationDto, required: true })
    recommendation: RecommendationDto;
}