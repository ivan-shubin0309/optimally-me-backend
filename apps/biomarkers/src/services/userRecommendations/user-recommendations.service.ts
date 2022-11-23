import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserRecommendation } from '../../models/userRecommendations/user-recommendation.entity';

@Injectable()
export class UserRecommendationsService extends BaseService<UserRecommendation> {
    constructor(
        @Inject('USER_RECOMMENDATION_MODEL') protected model: Repository<UserRecommendation>
    ) { super(model); }
}