import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { SexTypes } from '../../../../common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterSex } from './filter-sex.entity';

export class FilterSexDto extends BaseDto<FilterSex> {
    constructor(entity: FilterSex) {
        super(entity);
        this.sex = entity.sex;
        this.filterId = entity.filterId;
    }

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(SexTypes) })
    sex: number;

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;
}