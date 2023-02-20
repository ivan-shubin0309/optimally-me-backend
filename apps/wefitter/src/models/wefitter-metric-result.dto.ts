import { ApiProperty } from '@nestjs/swagger';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from './wefitter-sleep-summary.entity';

export class WefitterMetricResultDto {
    constructor(entity: UserWefitterDailySummary | UserWefitterHeartrateSummary | UserWefitterSleepSummary) {
        this.value = entity.get('value') as number;
        this.date = entity.get('date') as string;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly value: number;

    @ApiProperty({ type: () => String, required: true })
    readonly date: string;
}