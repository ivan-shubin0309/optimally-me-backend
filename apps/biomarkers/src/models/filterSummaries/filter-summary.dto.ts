import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { FilterSummary } from './filter-summary.entity';

export class FilterSummaryDto extends BaseDto<FilterSummary> {
    constructor(entity: FilterSummary) {
        super(entity);
        this.criticalLow = entity.criticalLow;
        this.low = entity.low;
        this.subOptimal = entity.subOptimal;
        this.optimal = entity.optimal;
        this.supraOptimal = entity.supraOptimal;
        this.high = entity.high;
        this.criticalHigh = entity.criticalHigh;
    }

    @ApiProperty({ type: () => String, required: false })
    readonly criticalLow: string;

    @ApiProperty({ type: () => String, required: false })
    readonly low: string;

    @ApiProperty({ type: () => String, required: false })
    readonly subOptimal: string;

    @ApiProperty({ type: () => String, required: false })
    readonly optimal: string;

    @ApiProperty({ type: () => String, required: false })
    readonly supraOptimal: string;

    @ApiProperty({ type: () => String, required: false })
    readonly high: string;

    @ApiProperty({ type: () => String, required: false })
    readonly criticalHigh: string;
}