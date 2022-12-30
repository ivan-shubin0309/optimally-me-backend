import { ApiProperty } from '@nestjs/swagger';
import { SkinTypes } from '../../../../common/src/resources/filters/skin-types';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterSkinType } from './filter-skin-type.entity';

export class FilterSkinTypeDto extends BaseDto<FilterSkinType> {
    constructor(entity: FilterSkinType) {
        super(entity);
        this.filterId = entity.filterId;
        this.skinType = entity.skinType;
        this.isIdealSkinType = entity.isIdealSkinType;
    }

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(SkinTypes) })
    skinType: number;

    @ApiProperty({ type: () => Boolean, required: true })
    isIdealSkinType: boolean;
}