import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class WefitterHeartRateDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly timestamp: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly duration: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly source: string;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    readonly is_manual: boolean;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly min: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly max: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly average: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly resting: number;
}
