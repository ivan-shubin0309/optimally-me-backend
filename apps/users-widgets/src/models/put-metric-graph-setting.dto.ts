import { ArrayNotEmpty, ArrayUnique, IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { WefitterMetricTypes } from '../../../common/src/resources/wefitter/wefitter-metric-types';
import { MetricGraphViews } from '../../../common/src/resources/users-widgets/metric-graph-views';
import { DateTime } from 'luxon';

export class PutMetricGraphSettingsDto {
    @ApiProperty({ type: () => String, required: false, example: DateTime.utc().toISO() })
    @IsOptional()
    @IsDateString()
    readonly startDate: string = null;

    @ApiProperty({ type: () => String, required: false, example: DateTime.utc().toISO() })
    @IsOptional()
    @IsDateString()
    readonly endDate: string = null;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(MetricGraphViews) })
    @IsOptional()
    @IsNumber()
    @IsEnum(MetricGraphViews)
    readonly activeView: MetricGraphViews = null;

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(WefitterMetricTypes) })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(WefitterMetricTypes, { each: true })
    readonly activeMetrics: WefitterMetricTypes[] = null;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isCollapsed: boolean = null;
}
