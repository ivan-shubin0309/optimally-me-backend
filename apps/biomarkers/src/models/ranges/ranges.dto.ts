import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RangesDto {

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly criticalLow: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly lowMin: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly lowMax: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly subOptimalMin: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly subOptimalMax: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly optimalMin: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly optimalMax: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly supraOptimalMin: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly supraOptimalMax: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly highMin: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly highMax: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly criticalHigh: number;
}