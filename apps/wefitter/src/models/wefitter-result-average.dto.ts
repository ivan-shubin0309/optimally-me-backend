import { ApiProperty } from '@nestjs/swagger';
import { Duration } from 'luxon';
import { WefitterMetricResultType } from './wefitter-metric-result.type';
import { fieldsForParsingDuration } from './wefitter-sleep-summary.entity';

export class WefitterResultAverageDto {
    constructor(entity: WefitterMetricResultType) {
        const isDuration = fieldsForParsingDuration.includes(entity.get('metricName') as string);
        this.avg = isDuration
            ? Duration
                .fromISOTime(
                    Duration
                        .fromMillis(entity.get('averageValue') as number * 1000)
                        .toISOTime()
                )
                .toISO()
            : entity.get('averageValue') as number;
        this.min = isDuration
            ? Duration
                .fromISOTime(
                    Duration
                        .fromMillis(entity.get('minValue') as number * 1000)
                        .toISOTime()
                )
                .toISO()
            : entity.get('minValue') as number;
        this.max = isDuration
            ? Duration
                .fromISOTime(
                    Duration
                        .fromMillis(entity.get('maxValue') as number * 1000)
                        .toISOTime()
                )
                .toISO()
            : entity.get('maxValue') as number;
        this.metricName = entity.get('metricName') as string;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly metricName: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly avg: number | string;

    @ApiProperty({ type: () => Number, required: false })
    readonly min: number | string;

    @ApiProperty({ type: () => Number, required: false })
    readonly max: number | string;
}