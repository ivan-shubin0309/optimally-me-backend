import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { WefitterSleepDetailDto } from './wefitter-sleep-detail.dto';

export class WefitterSleepDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly timestamp: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly timestamp_end: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly duration: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly source: string;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    readonly is_manual: boolean;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly awake: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly light: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly deep: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly rem: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly sleep_score: number;

    @ApiProperty({ type: () => [WefitterSleepDetailDto], required: false })
    @IsOptional()
    @Type(() => WefitterSleepDetailDto)
    readonly detail: WefitterSleepDetailDto[];

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly total_time_in_sleep: string;
}
