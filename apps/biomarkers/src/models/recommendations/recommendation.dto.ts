import { ApiProperty } from '@nestjs/swagger';
import { Recommendation } from './recommendation.entity';


export class RecommendationDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly category: number;

    @ApiProperty({ type: () => String, required: true })
    readonly content: string;

    constructor(entity: Recommendation) {
        this.category = entity.category;
        this.content = entity.content;
    }
}