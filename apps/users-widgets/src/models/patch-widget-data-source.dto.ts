import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { wefitterSources } from '../../../common/src/resources/wefitter/wefitter-sources';
import { wefitterMetricNames } from '../../../common/src/resources/wefitter/wefitter-metric-types';

export class PatchWidgetDataSourceDto {
    @ApiProperty({ type: () => String, required: true, description: wefitterSources.join(', ') })
    @IsNotEmpty()
    @IsString()
    @IsEnum(wefitterSources)
    readonly source: string;

    @ApiProperty({ type: () => String, required: true, description: wefitterMetricNames.join(', ') })
    @IsNotEmpty()
    @IsString()
    @IsEnum(wefitterMetricNames)
    readonly metricName: string;
}
