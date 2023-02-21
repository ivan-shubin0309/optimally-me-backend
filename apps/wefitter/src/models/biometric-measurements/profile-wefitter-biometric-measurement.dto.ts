import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WefitterBiometricMeasurementDto } from './wefitter-biometric-measurement.dto';

export class ProfileWefitterBiometricMeasurementDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly profile: string;

    @ApiProperty({ type: () => WefitterBiometricMeasurementDto, required: true })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => WefitterBiometricMeasurementDto)
    readonly data: WefitterBiometricMeasurementDto;
}
