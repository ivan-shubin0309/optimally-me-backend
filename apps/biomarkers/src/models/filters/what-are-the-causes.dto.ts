import { ApiProperty } from '@nestjs/swagger';
import { BulletListCategories } from '../../../../common/src/resources/filterBulletLists/bullet-list-types';
import { FilterBulletListDto } from '../filterBulletLists/filter-bullet-list.dto';
import { Filter } from './filter.entity';

export class WhatAreTheCausesDto {
    constructor(entity: Filter) {
        this.low = entity.whatAreTheCausesLow;
        this.high = entity.whatAreTheCausesHigh;
        this.bulletList = entity.bulletList && entity.bulletList.length
            ? entity.bulletList
                .filter(bullet => BulletListCategories.causes === bullet.category)
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