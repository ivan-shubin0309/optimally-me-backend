import { ApiProperty } from '@nestjs/swagger';
import { WefitterMetricResultsType } from './wefitter-metric-result.type';
import { WefitterResultAverageDto } from './wefitter-result-average.dto';

export class WefitterResultAveragesDto {
    @ApiProperty({ type: () => [WefitterResultAverageDto] })
    readonly data: WefitterResultAverageDto[];

    constructor(wefitterResults: WefitterMetricResultsType) {
        this.data = wefitterResults.map(wefitterResult => new WefitterResultAverageDto(wefitterResult));
    }
}