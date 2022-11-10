import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { FilterGroupTypes } from '../../../../common/src/resources/filterGroups/filter-group-types';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterGroup } from './filter-group.entity';

export class FilterGroupDto extends BaseDto<FilterGroup> {
    constructor(entity: FilterGroup) {
        super(entity);
        this.filterId = entity.filterId;
        this.type = entity.type;
        this.recommendationType = entity.recommendationType;
    }

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(FilterGroupTypes) })
    type: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationTypes) })
    recommendationType: number;
}