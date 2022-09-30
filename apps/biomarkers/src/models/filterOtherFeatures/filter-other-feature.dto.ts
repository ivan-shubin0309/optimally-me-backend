import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { OtherFeatureTypes } from '../../../../common/src/resources/filters/other-feature-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterOtherFeature } from './filter-other-feature.entity';

export class FilterOtherFeatureDto extends BaseDto<FilterOtherFeature> {
    constructor(entity: FilterOtherFeature) {
        super(entity);
        this.otherFeature = entity.otherFeature;
        this.filterId = entity.filterId;
    }

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(OtherFeatureTypes) })
    otherFeature: number;

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;
}