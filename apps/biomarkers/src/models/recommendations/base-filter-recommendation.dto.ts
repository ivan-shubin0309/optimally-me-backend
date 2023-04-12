import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';
import { FilterRecommendation } from './filter-recommendation.entity';

export class BaseFilterRecommendationDto extends BaseDto<FilterRecommendation>{
    constructor(entity: FilterRecommendation) {
        super(entity);
        this.filterId = entity.filterId;
        this.recommendationId = entity.recommendationId;
        this.order = entity.order;
        this.type = entity.type;
    }

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;

    @ApiProperty({ type: () => Number, required: true })
    recommendationId: number;

    @ApiProperty({ type: () => Number, required: true })
    order: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationTypes) })
    type: number;
}