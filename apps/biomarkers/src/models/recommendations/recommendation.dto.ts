import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { Recommendation } from './recommendation.entity';


export class RecommendationDto extends BaseDto<Recommendation> {
    @ApiProperty({ type: () => Number, required: true })
    readonly category: number;

    @ApiProperty({ type: () => String, required: true })
    readonly content: string;

    constructor(entity: Recommendation) {
        super(entity);
        this.category = entity.category;
        this.content = entity.content;
    }
}