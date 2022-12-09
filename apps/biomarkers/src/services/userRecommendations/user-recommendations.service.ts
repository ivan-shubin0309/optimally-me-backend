import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserResult } from '../../../../admins-results/src/models/user-result.entity';
import { BaseService } from '../../../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserRecommendation } from '../../models/userRecommendations/user-recommendation.entity';
import { Recommendation } from '../../models/recommendations/recommendation.entity';
import { PutReactRecommendationDto } from '../../../../users-results/src/models/put-react-recommendation.dto';
import { RecommendationReaction } from '../../models/recommendationReactions/recommendation-reaction.entity';
import { TranslatorService } from 'nestjs-translator';

@Injectable()
export class UserRecommendationsService extends BaseService<UserRecommendation> {
    constructor(
        @Inject('USER_RECOMMENDATION_MODEL') protected model: Repository<UserRecommendation>,
        @Inject('RECOMMENDATION_MODEL') private recommendationModel: Repository<Recommendation>,
        @Inject('RECOMMENDATION_REACTION_MODEL') private recommendationReactionModel: Repository<RecommendationReaction>,
        private readonly translator: TranslatorService,
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
                { method: ['withFiles'] },
                { method: ['withUserReaction', userResult.userId] },
            ])
            .findAll();

        return recommendations;
    }

    async reactToRecommendation(body: PutReactRecommendationDto, userId: number, recommendationId: number): Promise<RecommendationReaction> {
        const reaction = await this.recommendationReactionModel
            .scope([
                { method: ['byUserId', userId] },
                { method: ['byRecommendationId', recommendationId] }
            ])
            .findOne();

        if (reaction) {
            return await reaction.update(body);
        }

        return await this.recommendationReactionModel.create(Object.assign({ userId, recommendationId }, body) as any);
    }

    async removeReaction(userId: number, recommendationId: number): Promise<void> {
        const reaction = await this.recommendationReactionModel
            .scope([
                { method: ['byUserId', userId] },
                { method: ['byRecommendationId', recommendationId] }
            ])
            .findOne();

        if (!reaction) {
            throw new NotFoundException({
                message: this.translator.translate('RECOMMENDATION_REACTION_NOT_FOUND'),
                errorCode: 'RECOMMENDATION_REACTION_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await reaction.destroy();
    }
}