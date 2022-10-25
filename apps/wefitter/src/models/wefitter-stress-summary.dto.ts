import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class WefitterStressSummaryDto {

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly stress_qualifier: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly average_stress_level: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly max_stress_level: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly rest_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly low_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly medium_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly high_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly stress_duration: string;
}
