import { ApiProperty } from '@nestjs/swagger';
import { BulletListCategories } from '../../../../common/src/resources/filterBulletLists/bullet-list-types';
import { FilterBulletListDto } from '../filterBulletLists/filter-bullet-list.dto';
import { Filter } from './filter.entity';

export class WhatAreTheRisksDto {
    constructor(entity: Filter) {
        this.low = entity.whatAreTheRisksLow;
        this.high = entity.whatAreTheRisksHigh;
        this.bulletList = entity.bulletList && entity.bulletList.length
            ? entity.bulletList
                .filter(bullet => BulletListCategories.risks === bullet.category)
                .map(bullet => new FilterBulletListDto(bullet))
            : undefined;
    }

    @ApiProperty({ type: () => String, required: false })
    readonly low: string;

    @ApiProperty({ type: () => String, required: false })
    readonly high: string;

    @ApiProperty({ type: () => [FilterBulletListDto], required: false })
    readonly bulletList: FilterBulletListDto[];
}