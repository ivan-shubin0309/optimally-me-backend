import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RecommendationItemDto } from './recommendation-item.dto';

export class RecommendationsDto {

    @ApiProperty({ type: () => RecommendationItemDto, required: true })
    @IsNotEmpty()
    readonly criticalLow: RecommendationItemDto[];

    @ApiProperty({ type: () => RecommendationItemDto, required: true })
    @IsNotEmpty()
    readonly low: RecommendationItemDto[];

    @ApiProperty({ type: () => RecommendationItemDto, required: true })
    @IsNotEmpty()
    readonly high: RecommendationItemDto[];

    @ApiProperty({ type: () => RecommendationItemDto, required: true })
    @IsNotEmpty()
    readonly criticalHigh: RecommendationItemDto[];
}