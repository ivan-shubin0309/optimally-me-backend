import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class WefitterStressSummaryDto {

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly stress_qualifier: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly average_stress_level: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly max_stress_level: number;

    @ApiProperty({ type: () => String, required: false })
    readonly rest_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    readonly low_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    readonly medium_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    readonly high_stress_duration: string;

    @ApiProperty({ type: () => String, required: false })
    readonly stress_duration: string;
}
