import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RangeItemDto } from './range-item.dto';

export class RangesDto {

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly criticalLow: number;

    @ApiProperty({ type: () => RangeItemDto, required: true })
    @IsNotEmpty()
    readonly low: RangeItemDto;

    @ApiProperty({ type: () => RangeItemDto, required: true })
    @IsNotEmpty()
    readonly subOptimal: RangeItemDto;

    @ApiProperty({ type: () => RangeItemDto, required: true })
    @IsNotEmpty()
    readonly optimal: RangeItemDto;

    @ApiProperty({ type: () => RangeItemDto, required: true })
    @IsNotEmpty()
    readonly supraOptimal: RangeItemDto;

    @ApiProperty({ type: () => RangeItemDto, required: true })
    @IsNotEmpty()
    readonly high: RangeItemDto;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly criticalHigh: number;
}