import { ApiProperty } from '@nestjs/swagger';
import { Filter } from './filter.entity';

export class WhatAreTheRisksDto {
    constructor(entity: Filter) {
        this.low = entity.whatAreTheRisksLow;
        this.high = entity.whatAreTheRisksHigh;
    }

    @ApiProperty({ type: () => String, required: false })
    readonly low: string;

    @ApiProperty({ type: () => String, required: false })
    readonly high: string;
}