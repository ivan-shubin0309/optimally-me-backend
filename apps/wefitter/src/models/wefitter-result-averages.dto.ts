import { ApiProperty } from '@nestjs/swagger';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './wefitter-heartrate-summary.entity';
import { WefitterResultAverageDto } from './wefitter-result-average.dto';
import { UserWefitterSleepSummary } from './wefitter-sleep-summary.entity';
import { UserWefitterStressSummary } from './wefitter-stress-summary.entity';

export class WefitterResultAveragesDto {
    @ApiProperty({ type: () => [WefitterResultAverageDto] })
    readonly data: WefitterResultAverageDto[];

    constructor(wefitterResults: UserWefitterDailySummary[] | UserWefitterHeartrateSummary[] | UserWefitterSleepSummary[] | UserWefitterStressSummary[]) {
        this.data = wefitterResults.map(wefitterResult => new WefitterResultAverageDto(wefitterResult));
    }
}