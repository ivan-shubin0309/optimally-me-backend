import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WefitterHeartRateDto } from './wefitter-heart-rate.dto';
import { WefitterStressSummaryDto } from './wefitter-stress-summary.dto';

export class WefitterDailySummaryDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly bearer: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly date: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly distance: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly steps: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly calories: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly active_calories: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly bmr_calories: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly points: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly source: string;

    @ApiProperty({ type: () => WefitterHeartRateDto, required: false })
    readonly heart_rate_summary: WefitterHeartRateDto;

    @ApiProperty({ type: () => WefitterStressSummaryDto, required: false })
    readonly stress_summary: WefitterStressSummaryDto;

}
