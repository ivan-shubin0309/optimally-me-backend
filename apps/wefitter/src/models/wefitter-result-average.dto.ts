import { ApiProperty } from '@nestjs/swagger';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from './wefitter-sleep-summary.entity';
import { UserWefitterStressSummary } from './wefitter-stress-summary.entity';

export class WefitterResultAverageDto {
    constructor(entity: UserWefitterDailySummary | UserWefitterHeartrateSummary | UserWefitterSleepSummary | UserWefitterStressSummary) {
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