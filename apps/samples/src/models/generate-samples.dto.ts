import { IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateSamplesDto {
    @ApiProperty({ type: () => Number, required: true, default: 10000 })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    readonly quantity: number;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly isGenerateNew: boolean;
}
