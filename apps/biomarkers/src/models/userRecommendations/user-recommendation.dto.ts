import { ApiProperty } from '@nestjs/swagger';
import { UserResultDto } from 'apps/admins-results/src/models/user-result.dto';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationDto } from '../recommendations/recommendation.dto';
import { UserRecommendation } from './user-recommendation.entity';

export class UserRecommendationDto extends BaseDto<UserRecommendation> {
    constructor(entity: UserRecommendation) {
        super(entity);
        this.userId = entity.userId;
        this.recommendationId = entity.recommendationId;
        this.userResultId = entity.userResultId;
        this.recommendation = entity.recommendation
            ? new RecommendationDto(entity.recommendation)
            : undefined;
        this.userResult = entity.userResult
            ? new UserResultDto(entity.userResult)
            : undefined;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly recommendationId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly userResultId: number;

    @ApiProperty({ type: () => RecommendationDto, required: true })
    readonly recommendation: RecommendationDto;

    @ApiProperty({ type: () => UserResultDto, required: true })
    readonly userResult: UserResultDto;
}