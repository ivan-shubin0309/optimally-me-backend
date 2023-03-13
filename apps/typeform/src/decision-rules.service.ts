import { HttpStatus, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Solver } from '@decisionrules/decisionrules-js';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { DateTime } from 'luxon';
import { RecommendationTypes } from '../../common/src/resources/recommendations/recommendation-types';
import { UsersRecommendationsService } from '../../users-recommendations/src/users-recommendations.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';

interface IRuleData {
    customer: {
        id: number;
        attributes: string[];
    };
    biomarkerResult: {
        value: number;
        range: string;
    };
    recommendations: Array<{
        id: number;
        name: string;
    }>
    form_response: any;
}

interface IRuleResponseObject {
    customer: {
        id: number;
        attributes: string[];
    };
    recommendations: Array<{
        id: number;
        name: string;
        exclude: true
    }>;
}

@Injectable()
export class DecisionRulesService {
    private readonly solver: Solver;

    constructor(
        private readonly configService: ConfigService,
        private readonly usersBiomarkersService: UsersBiomarkersService,
        private readonly userRecommendationsService: UsersRecommendationsService,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    ) {
        this.solver = new Solver(configService.get('DECISION_RULES_SOLVER_API_KEY'));
    }

    solveRule(data: IRuleData): Promise<IRuleResponseObject> {
        return this.solver.solveRule(this.configService.get('DECISION_RULES_RECOMMENDATIONS_ITEM_ID'), { data });
    }

    async updateUserRecommendations(userId: number, typeformQuizData: any, transaction: Transaction): Promise<void> {
        const lastResultIds = await this.usersBiomarkersService.getLastResultIdsByDate(userId, DateTime.utc().toFormat('yyyy-MM-dd'), 1);
        const biomarkerScopes = [
            { method: ['byType', [BiomarkerTypes.blood, BiomarkerTypes.skin]] },
            { method: ['withLastResult', lastResultIds, true] }
        ];
        const biomarkersList = await this.usersBiomarkersService.getList(biomarkerScopes);
        if (!biomarkersList.length) {
            return;
        }

        const promises = biomarkersList.map(async biomarker => {
            const recommendations = await this.userRecommendationsService.getRecommendationListByUserResult(
                biomarker.lastResult,
                {
                    biomarkerId: biomarker.id,
                    additionalScopes: [{ method: ['withUserRecommendation', biomarker.lastResult.id] }]
                }
            );

            if (!recommendations.length) {
                return null;
            }

            const payload: IRuleData = {
                customer: {
                    id: userId,
                    attributes: []
                },
                biomarkerResult: {
                    value: biomarker.lastResult.value,
                    range: RecommendationTypes[biomarker.lastResult.recommendationRange]
                },
                recommendations: recommendations.map(recommendation => ({
                    id: recommendation.userRecommendation.id,
                    name: recommendation.title,
                })),
                form_response: typeformQuizData,
            };

            console.log(JSON.stringify(payload));

            return this.solveRule(payload)
                .catch(err => {
                    console.log(`\nError on biomarker id - ${biomarker.id} `);
                    throw new UnprocessableEntityException({
                        message: err.message,
                        errorCode: 'DECISION_RULES_ERROR',
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                    });
                });
        });

        const results = await Promise.all(promises);

        const userRecommendationIdsToExclude = [];
        const userRecommendationIdsToInclude = [];

        results.forEach(result => {
            if (result && result[0]) {
                result[0].recommendations.forEach(recommendation => {
                    if (recommendation.exclude) {
                        userRecommendationIdsToExclude.push(recommendation.id);
                    } else {
                        userRecommendationIdsToInclude.push(recommendation.id);
                    }
                });
            }
        });

        if (userRecommendationIdsToExclude.length) {
            await this.userRecommendationsService.update(
                { isExcluded: true },
                { method: ['byId', userRecommendationIdsToExclude] } as any,
                transaction
            );
        }

        if (userRecommendationIdsToInclude.length) {
            await this.userRecommendationsService.update(
                { isExcluded: false },
            { method: ['byId', userRecommendationIdsToInclude] } as any,
            transaction
        );
        }
    }
}