import { MAX_USER_RESULT_AVARAGES } from '../../../common/src/resources/userResults/constants';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { wefitterMetricNames } from '../../../common/src/resources/wefitter/wefitter-metric-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';

export class GetWefitterResultAveragesDto {
    @ApiProperty({ type: () => [String], required: true, description: wefitterMetricNames.join(', ') })
    @IsNotEmpty()
    @ArrayNotEmpty()
    @IsArray()
    @ArrayUnique()
    @ArrayMaxSize(MAX_USER_RESULT_AVARAGES)
    @IsEnum(wefitterMetricNames, { each: true })
    @Type(() => String)
    @Transform(({ value }) => typeof value === 'string' ? [value] : value)
    readonly metricNames: string[];

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly startDate: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsOnlyDate()
    readonly endDate: string;
}