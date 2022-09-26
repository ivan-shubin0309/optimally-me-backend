import { IsNotEmpty, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RangeItemDto {

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly min: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNumber()
    @IsNotEmpty()
    readonly max: number;
}