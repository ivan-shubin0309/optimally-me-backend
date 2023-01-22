import { ApiProperty } from '@nestjs/swagger';

export class WefitterMetricMetadataDto {
    constructor(fieldName: string, metricName: string) {
        this.fieldName = fieldName;
        this.metricName = metricName;
    }

    @ApiProperty({ type: () => String })
    readonly fieldName: string;

    @ApiProperty({ type: () => String })
    readonly metricName: string;
}
