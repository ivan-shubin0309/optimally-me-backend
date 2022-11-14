import { ApiProperty } from '@nestjs/swagger';
import { Filter } from './filter.entity';

export class WhatAreTheCausesDto {
    constructor(entity: Filter) {
        this.low = entity.whatAreTheCausesLow;
        this.high = entity.whatAreTheCausesHigh;
    }

    @ApiProperty({ type: () => String, required: false })
    readonly low: string;

    @ApiProperty({ type: () => String, required: false })
    readonly high: string;
}