import { ApiProperty } from '@nestjs/swagger';
import { WefitterMetricResultType } from './wefitter-metric-result.type';

export class WefitterResultAverageDto {
    constructor(entity: WefitterMetricResultType) {
        this.avg = entity.get('averageValue') as number;
        this.min = entity.get('minValue') as number;
        this.max = entity.get('maxValue') as number;
        this.metricName = entity.get('metricName') as string;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly metricName: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly avg: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly min: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly max: number;
}