import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { wefitterMetricNames } from '../../../common/src/resources/wefitter/wefitter-metric-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';

export class GetWefitterResultsDto {
    @ApiProperty({ type: () => Number, required: true, default: 100 })
    @IsInt()
    @Max(1000)
    @Min(1)
    @Transform(({ value }) => Number(value))
    readonly limit: number = 100;

    @ApiProperty({ type: () => Number, required: true, default: 0 })
    @IsInt()
    @Min(0)
    @Transform(({ value }) => Number(value))
    readonly offset: number = 0;

    @ApiProperty({ type: () => String, required: true, description: wefitterMetricNames.join(', ') })
    @IsNotEmpty()
    @IsEnum(wefitterMetricNames)
    @Type(() => String)
    readonly metricName: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly startDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly endDate: string;
}