import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterContradiction } from './filter-contradiction.entity';
import { ContradictionTypes } from '../../../../common/src/resources/filters/contradiction-types';

export class FilterContradictionDto extends BaseDto<FilterContradiction> {
    constructor(entity: FilterContradiction) {
        super(entity);
        this.filterId = entity.filterId;
        this.contradictionType = entity.contradictionType;
    }

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(ContradictionTypes) })
    contradictionType: number;
}