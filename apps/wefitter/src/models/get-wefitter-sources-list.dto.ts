import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { wefitterMetricNames } from '../../../common/src/resources/wefitter/wefitter-metric-types';
import { ApiProperty } from '@nestjs/swagger';

export class GetWefitterSourcesListDto {
    @ApiProperty({ type: () => String, required: true, description: wefitterMetricNames.join(', ') })
    @IsNotEmpty()
    @IsEnum(wefitterMetricNames)
    @Type(() => String)
    readonly metricName: string;
}