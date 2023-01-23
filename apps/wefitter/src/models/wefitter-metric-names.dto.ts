import { ApiProperty } from '@nestjs/swagger';

export class WefitterMetricNamesDto {
    constructor(metricNames: string[]) {
        this.metricNames = metricNames;
    }

    @ApiProperty({ type: () => [String], required: true })
    readonly metricNames: string[];
}
