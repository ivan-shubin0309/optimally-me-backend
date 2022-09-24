import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RangeItemDto {

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNotEmpty()
    readonly min: number;

    @ApiProperty({ type: () => Number, required: true })
    @MaxLength(10)
    @IsNotEmpty()
    readonly max: number;
}