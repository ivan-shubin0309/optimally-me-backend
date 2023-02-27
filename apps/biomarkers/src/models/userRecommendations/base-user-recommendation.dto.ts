import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { UserRecommendation } from './user-recommendation.entity';

export class BaseUserRecommendationDto extends BaseDto<UserRecommendation> {
    constructor(entity: UserRecommendation) {
        super(entity);
        this.userId = entity.userId;
        this.recommendationId = entity.recommendationId;
        this.userResultId = entity.userResultId;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly recommendationId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly userResultId: number;
}