import { ApiProperty } from '@nestjs/swagger';
import { UserResultDto } from 'apps/admins-results/src/models/user-result.dto';
import { RecommendationDto } from '../recommendations/recommendation.dto';
import { BaseUserRecommendationDto } from './base-user-recommendation.dto';
import { UserRecommendation } from './user-recommendation.entity';

export class UserRecommendationDto extends BaseUserRecommendationDto {
    constructor(entity: UserRecommendation) {
        super(entity);
        this.recommendation = entity.recommendation
            ? new RecommendationDto(entity.recommendation)
            : undefined;
        this.userResult = entity.userResult
            ? new UserResultDto(entity.userResult)
            : undefined;
    }

    @ApiProperty({ type: () => RecommendationDto, required: true })
    readonly recommendation: RecommendationDto;

    @ApiProperty({ type: () => UserResultDto, required: true })
    readonly userResult: UserResultDto;
}