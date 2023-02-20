import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WefitterBiometricMeasurementDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    timestamp: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    end: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    source: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    measurement_type: string;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    is_manual: boolean;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    value: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    unit: string;
}
