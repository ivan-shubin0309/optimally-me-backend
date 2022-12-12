import { Inject, Injectable } from '@nestjs/common';
import { UserResult } from '../../../../admins-results/src/models/user-result.entity';
import { BaseService } from '../../../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserRecommendation } from '../../models/userRecommendations/user-recommendation.entity';
import { Recommendation } from '../../models/recommendations/recommendation.entity';

@Injectable()
export class UserRecommendationsService extends BaseService<UserRecommendation> {
    constructor(
        @Inject('USER_RECOMMENDATION_MODEL') protected model: Repository<UserRecommendation>,
        @Inject('RECOMMENDATION_MODEL') protected recommendationModel: Repository<Recommendation>,
    ) { super(model); }

    async getRecommendationList(userResult: UserResult): Promise<Recommendation[]> {
        const userRecommendations = await this.getList([{ method: ['byUserResultId', userResult.id] }]);

        if (!userRecommendations.length) {
            return [];
        }

        const recommendations = await this.recommendationModel
            .scope([
                { method: ['byId', userRecommendations.map(userRecommendation => userRecommendation.recommendationId)] },
                { method: ['withImpacts', ['withStudyLinks']] },
                { method: ['withFiles'] }
            ])
            .findAll();

        return recommendations;
    }
}