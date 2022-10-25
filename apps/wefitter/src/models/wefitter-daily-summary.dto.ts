import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WefitterHeartRateDto } from './wefitter-heart-rate.dto';
import { WefitterStressSummaryDto } from './wefitter-stress-summary.dto';

export class WefitterDailySummaryDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly bearer: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly date: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly distance: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly steps: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly calories: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly active_calories: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly bmr_calories: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly points: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly source: string;

    @ApiProperty({ type: () => WefitterHeartRateDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => WefitterHeartRateDto)
    readonly heart_rate_summary: WefitterHeartRateDto;

    @ApiProperty({ type: () => WefitterStressSummaryDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => WefitterStressSummaryDto)
    readonly stress_summary: WefitterStressSummaryDto;

}
