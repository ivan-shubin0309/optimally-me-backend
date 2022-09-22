import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecommendationItemDto {

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly recommendationOrder: number;
}