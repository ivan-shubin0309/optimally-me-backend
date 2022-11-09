import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class WefitterSleepDetailDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly timestamp: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly timestamp_end: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly level: string;
}