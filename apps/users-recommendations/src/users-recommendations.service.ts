import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { TranslatorService } from 'nestjs-translator';
import { ScopeOptions, Transaction } from 'sequelize';
import { BaseService } from '../../common/src/base/base.service';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationReaction } from '../../biomarkers/src/models/recommendationReactions/recommendation-reaction.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { PutReactRecommendationDto } from '../../users-results/src/models/put-react-recommendation.dto';

@Injectable()
export class UsersRecommendationsService extends BaseService<UserRecommendation> {
    constructor(
        @Inject('USER_RECOMMENDATION_MODEL') protected readonly model: Repository<UserRecommendation>,
        @Inject('RECOMMENDATION_MODEL') private readonly recommendationModel: Repository<Recommendation>,
        @Inject('RECOMMENDATION_REACTION_MODEL') private readonly recommendationReactionModel: Repository<RecommendationReaction>,
        private readonly translator: TranslatorService,
        @Inject('USER_RESULT_MODEL') private readonly userResultModel: Repository<UserResult>,
    ) { super(model); }

    async getRecommendationListByUserResult(userResult: UserResult, options: { biomarkerId: number, additionalScopes?: any[], isExcluded?: boolean }, transaction?: Transaction): Promise<Recommendation[]> {
        const scopesForUserRecommendations: ScopeOptions[] = [
            { method: ['byUserResultId', userResult.id] },
        ];

        if (typeof options.isExcluded === 'boolean') {
            scopesForUserRecommendations.push({ method: ['byIsExcluded', options.isExcluded] });
        }

        const userRecommendations = await this.getList(scopesForUserRecommendations, transaction);

        if (!userRecommendations.length) {
            return [];
        }

        const scopes: any[] = [
            { method: ['byId', userRecommendations.map(userRecommendation => userRecommendation.recommendationId)] },
            { method: ['withImpacts', ['withStudyLinks'], options?.biomarkerId] },
            { method: ['withFiles'] },
            { method: ['withUserReaction', userResult.userId, true] },
            { method: ['withContradictions'] },
        ];

        if (options?.additionalScopes?.length) {
            scopes.push(...options.additionalScopes);
        }

        const recommendations = await this.recommendationModel
            .scope(scopes)
            .findAll({ transaction });

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

        return await this.recommendationReactionModel.create({
            userId,
            recommendationId,
            description: body.description,
            reactionType: body.reactionType
        });
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

    async getRecommendationCount(scopes = [], transaction?: Transaction): Promise<number> {
        return this.recommendationModel
            .scope(scopes)
            .count({ transaction });
    }

    async getRecommendationList(scopes = [], transaction?: Transaction): Promise<Recommendation[]> {
        return this.recommendationModel
            .scope(scopes)
            .findAll({ transaction });
    }

    async attachBiomarkersToRecommendations(userResultIds: number[], recommendations: Recommendation[], userId: number) {
        const userResults = await this.userResultModel
            .scope([
                { method: ['byId', userResultIds] },
                { method: ['withUserRecommendation', userId, recommendations.map(recommendation => recommendation.id)] },
                { method: ['withBiomarker'] }
            ])
            .findAll();

        const biomarkersMap = {};

        userResults.forEach(userResult => {
            if (userResult.userRecommendations && userResult.userRecommendations.length) {
                userResult.userRecommendations.forEach(userRecommendation => {
                    if (!biomarkersMap[userRecommendation.recommendationId]) {
                        biomarkersMap[userRecommendation.recommendationId] = [];
                    }

                    biomarkersMap[userRecommendation.recommendationId].push(userResult.biomarker);
                });
            }
        });

        recommendations.forEach(recommendation => {
            recommendation.biomarkers = biomarkersMap[recommendation.id];
            recommendation.setDataValue('biomarkers', biomarkersMap[recommendation.id]);
        });
    }

    async update(body: { isExcluded: boolean }, scopes: any[], transaction?: Transaction): Promise<[number, UserRecommendation[]]> {
        return this.model.scope(scopes).update(body, { transaction } as any);
    }
}