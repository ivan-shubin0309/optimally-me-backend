import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { FilterSummaryDto } from '../filterSummaries/filter-summary.dto';
import { Filter } from './filter.entity';
import { WhatAreTheCausesDto } from './what-are-the-causes.dto';
import { WhatAreTheRisksDto } from './what-are-the-risks.dto';

export class UserFilterDto extends BaseDto<Filter> {
    constructor(entity: Filter) {
        super(entity);
        this.biomarkerId = entity.biomarkerId;
        this.name = entity.name;
        this.summary = entity.summary;
        this.resultSummary = entity.resultSummary
            ? new FilterSummaryDto(entity.resultSummary)
            : undefined;
        this.whatIsIt = entity.whatIsIt;
        this.whatAreTheCauses = new WhatAreTheCausesDto(entity);
        this.whatAreTheRisks = new WhatAreTheRisksDto(entity);
        this.whatCanYouDo = entity.whatCanYouDo;
        this.criticalLow = entity.get('criticalLow');
        this.lowMin = entity.get('lowMin');
        this.lowMax = entity.get('lowMax');
        this.subOptimalMin = entity.get('subOptimalMin');
        this.subOptimalMax = entity.get('subOptimalMax');
        this.optimalMin = entity.get('optimalMin');
        this.optimalMax = entity.get('optimalMax');
        this.supraOptimalMin = entity.get('supraOptimalMin');
        this.supraOptimalMax = entity.get('supraOptimalMax');
        this.highMin = entity.get('highMin');
        this.highMax = entity.get('highMax');
        this.criticalHigh = entity.get('criticalHigh');
    }

    @ApiProperty({ type: () => Number, required: true })
    biomarkerId: number;

    @ApiProperty({ type: () => String, required: true })
    name: string;

    @ApiProperty({ type: () => String, required: false })
    summary: string;

    @ApiProperty({ type: () => FilterSummaryDto, required: false })
    resultSummary: FilterSummaryDto;

    @ApiProperty({ type: () => String, required: false })
    whatIsIt: string;

    @ApiProperty({ type: () => WhatAreTheCausesDto, required: false })
    whatAreTheCauses: WhatAreTheCausesDto;

    @ApiProperty({ type: () => WhatAreTheRisksDto, required: false })
    whatAreTheRisks: WhatAreTheRisksDto;

    @ApiProperty({ type: () => String, required: false })
    whatCanYouDo: string;

    @ApiProperty({ type: () => Number, required: false })
    criticalLow: number;

    @ApiProperty({ type: () => Number, required: false })
    lowMin: number;

    @ApiProperty({ type: () => Number, required: false })
    lowMax: number;

    @ApiProperty({ type: () => Number, required: false })
    subOptimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    subOptimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    optimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    optimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    supraOptimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    supraOptimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    highMin: number;

    @ApiProperty({ type: () => Number, required: false })
    highMax: number;

    @ApiProperty({ type: () => Number, required: false })
    criticalHigh: number;
}