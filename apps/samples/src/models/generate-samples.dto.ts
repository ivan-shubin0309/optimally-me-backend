import { IsNotEmpty, IsNumber, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateSamplesDto {
    @ApiProperty({ type: () => Number, required: true, default: 10000 })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    readonly quantity: number;
}
