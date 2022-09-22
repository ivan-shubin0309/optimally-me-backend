import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RangeItemDto {

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly min: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly max: number;
}