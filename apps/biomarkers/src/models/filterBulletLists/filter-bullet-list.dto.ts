import { ApiProperty } from '@nestjs/swagger';
import { BulletListTypes } from 'apps/common/src/resources/filterBulletLists/bullet-list-types';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { FilterBulletList } from './filter-bullet-list.entity';

export class FilterBulletListDto extends BaseDto<FilterBulletList> {
    constructor(entity: FilterBulletList) {
        super(entity);
        this.filterId = entity.filterId;
        this.type = entity.type;
        this.content = entity.content;
    }

    @ApiProperty({ type: () => Number, required: true })
    filterId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(BulletListTypes) })
    type: number;

    @ApiProperty({ type: () => String, required: true })
    content: string;
}