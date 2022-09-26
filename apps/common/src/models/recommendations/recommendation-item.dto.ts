import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecommendationItemDto {

    @ApiProperty({ type: () => Number, required: true })
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNumber()
    @IsNotEmpty()
    readonly order: number;
}