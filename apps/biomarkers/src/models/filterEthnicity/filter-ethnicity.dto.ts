import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { EthnicityTypes } from '../../../../common/src/resources/filters/ethnicity-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterEthnicity } from './filter-ethnicity.entity';

export class FilterEthnicityDto extends BaseDto<FilterEthnicity> {
    constructor(entity: FilterEthnicity) {
        super(entity);
        this.ethnicity = entity.ethnicity;
        this.filterId = entity.filterId;
    }

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(EthnicityTypes) })
    ethnicity: number;

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;
}