import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { AgeTypes } from '../../../../common/src/resources/filters/age-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterAge } from './filter-age.entity';

export class FilterAgeDto extends BaseDto<FilterAge> {
    constructor(entity: FilterAge) {
        super(entity);
        this.age = entity.age;
        this.filterId = entity.filterId;
    }

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(AgeTypes) })
    age: number;

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;
}