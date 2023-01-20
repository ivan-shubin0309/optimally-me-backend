import { ApiProperty } from '@nestjs/swagger';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './wefitter-heartrate-summary.entity';
import { WefitterResultAvarageDto } from './wefitter-result-avarage.dto';
import { UserWefitterSleepSummary } from './wefitter-sleep-summary.entity';
import { UserWefitterStressSummary } from './wefitter-stress-summary.entity';

export class WefitterResultAvaragesDto {
    @ApiProperty({ type: () => [WefitterResultAvarageDto] })
    readonly data: WefitterResultAvarageDto[];

    constructor(wefitterResults: UserWefitterDailySummary[] | UserWefitterHeartrateSummary[] | UserWefitterSleepSummary[] | UserWefitterStressSummary[]) {
        this.data = wefitterResults.map(wefitterResult => new WefitterResultAvarageDto(wefitterResult));
    }
}