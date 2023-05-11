import { ApiProperty } from '@nestjs/swagger';

export class UserBiomarkerCounterDto {
    constructor(counter: any) {
        this.critical = counter.critical;
        this.bad = counter.bad;
        this.borderline = counter.borderline;
        this.optimal = counter.optimal;
        this.poor = counter.poor;
        this.canDoBetter = counter.canDoBetter;
        this.scopeToImprove = counter.scopeToImprove;
        this.good = counter.good;
        this.great = counter.great;
    }

    @ApiProperty({ type: () => Number, required: false })
    readonly critical: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly bad: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly borderline: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly optimal: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly poor: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly canDoBetter: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly scopeToImprove: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly good: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly great: number;
}