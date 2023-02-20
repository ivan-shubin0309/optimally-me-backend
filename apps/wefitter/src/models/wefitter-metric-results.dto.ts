import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './wefitter-heartrate-summary.entity';
import { WefitterMetricMetadataDto } from './wefitter-metric-metadata.dto';
import { WefitterMetricResultDto } from './wefitter-metric-result.dto';
import { UserWefitterSleepSummary } from './wefitter-sleep-summary.entity';

export class WefitterMetricResultsDto {
    @ApiProperty({ type: () => [WefitterMetricResultDto] })
    readonly data: WefitterMetricResultDto[];

    @ApiProperty({ type: () => WefitterMetricMetadataDto })
    readonly metadata: WefitterMetricMetadataDto;

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(metricResults: UserWefitterDailySummary[] | UserWefitterHeartrateSummary[] | UserWefitterSleepSummary[], metadata: { metricName: string, fieldName: string }, pagination: PaginationDto) {
        this.metadata = new WefitterMetricMetadataDto(metadata.fieldName, metadata.metricName);
        this.pagination = pagination;
        this.data = metricResults.map(metricResult => new WefitterMetricResultDto(metricResult));
    }
}
