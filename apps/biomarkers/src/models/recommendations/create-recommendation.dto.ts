import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

class RecommendationObject {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly order: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    readonly recommendationId: number;
}

export class CreateRecommendationDto {
    @ApiProperty({ type: () => [RecommendationObject], required: false })
    @Type(() => RecommendationObject)
    readonly criticalLow: RecommendationObject[];

    @ApiProperty({ type: () => [RecommendationObject], required: false })
    @Type(() => RecommendationObject)
    readonly low: RecommendationObject[];

    @ApiProperty({ type: () => [RecommendationObject], required: false })
    @Type(() => RecommendationObject)
    readonly high: RecommendationObject[];

    @ApiProperty({ type: () => [RecommendationObject], required: false })
    @Type(() => RecommendationObject)
    readonly criticalHigh: RecommendationObject[];
}