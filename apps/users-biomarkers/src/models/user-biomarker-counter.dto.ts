import { ApiProperty } from '@nestjs/swagger';

export class UserBiomarkerCounterDto {
    constructor(counter: any) {
        this.critical = counter.critical;
        this.bad = counter.bad;
        this.borderline = counter.borderline;
        this.optimal = counter.optimal;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly critical: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly bad: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly borderline: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly optimal: number;
}