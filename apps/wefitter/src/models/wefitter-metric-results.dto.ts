import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { WefitterMetricMetadataDto } from './wefitter-metric-metadata.dto';
import { WefitterMetricResultDto } from './wefitter-metric-result.dto';
import { WefitterMetricResultsType } from './wefitter-metric-result.type';

export class WefitterMetricResultsDto {
    @ApiProperty({ type: () => [WefitterMetricResultDto] })
    readonly data: WefitterMetricResultDto[];

    @ApiProperty({ type: () => WefitterMetricMetadataDto })
    readonly metadata: WefitterMetricMetadataDto;

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(metricResults: WefitterMetricResultsType, metadata: { metricName: string, fieldName: string }, pagination: PaginationDto) {
        this.metadata = new WefitterMetricMetadataDto(metadata.fieldName, metadata.metricName);
        this.pagination = pagination;
        this.data = metricResults.map(metricResult => new WefitterMetricResultDto(metricResult));
    }
}
