import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class WefitterHeartRateDto {

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
