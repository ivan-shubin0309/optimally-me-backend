import { HttpStatus, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Solver } from '@decisionrules/decisionrules-js';
import { UsersBiomarkersService } from '../../users-biomarkers/src/users-biomarkers.service';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { DateTime } from 'luxon';
import { RecommendationTypes } from '../../common/src/resources/recommendations/recommendation-types';
import { UsersRecommendationsService } from '../../users-recommendations/src/users-recommendations.service';
import { Sequelize } from 'sequelize-typescript';
import { ScopeOptions } from 'sequelize';
import { UsersTagsService } from '../../users-tags/src/users-tags.service';
import { recommendationCategoryToString } from '../../common/src/resources/recommendations/recommendation-category-types';
import { Transaction } from 'sequelize';

interface IRuleData {
    customer: {
        id: number;
        attributes: string[];
    };
    biomarkerResult: {
        value: number;
        range: string;
        name: string;
        category: string;
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
        private readonly usersTagsService: UsersTagsService,
    ) {
        this.solver = new Solver(configService.get('DECISION_RULES_SOLVER_API_KEY'));
    }

    solveRule(data: IRuleData): Promise<IRuleResponseObject> {
        return this.solver.solveRule(this.configService.get('DECISION_RULES_RECOMMENDATIONS_ITEM_ID'), { data });
    }

    async updateUserRecommendations(userId: number, typeformQuizData: any, transaction: Transaction): Promise<void> {
        let isError = false;
        const typeformQuizDataWithoutHidden = Object.assign({}, typeformQuizData);
        typeformQuizDataWithoutHidden.hidden = { gender: typeformQuizDataWithoutHidden?.hidden?.gender };

        const lastResultIds = await this.usersBiomarkersService.getLastResultIdsByDate(userId, { beforeDate: DateTime.utc().toISO() }, 1, transaction);
        const biomarkerScopes: ScopeOptions[] = [
            { method: ['byType', [BiomarkerTypes.blood, BiomarkerTypes.skin]] },
            { method: ['withLastResult', lastResultIds, true] },
            { method: ['withCategory', true] },
        ];
        const biomarkersList = await this.usersBiomarkersService.getList(biomarkerScopes, transaction);
        console.log(`biomarkers list: ${JSON.stringify(biomarkersList.map(biomarker => biomarker.id))}`);

        if (!biomarkersList.length) {
            return;
        }

        const results = [];

        for (let i = 0; i < biomarkersList.length; i++) {
            const recommendations = await this.userRecommendationsService.getRecommendationListByUserResult(
                biomarkersList[i].lastResult,
                {
                    biomarkerId: biomarkersList[i].id,
                    additionalScopes: [
                        { method: ['withUserRecommendation', biomarkersList[i].lastResult.id] }, 
                        'withRecommendationTag'
                    ]
                },
                transaction
            );

            console.log(`recommendations list: ${JSON.stringify(recommendations.map(recommendation => recommendation.id))}`);

            if (!recommendations.length) {
                continue;
            }

            const userTags = await this.usersTagsService.getList([
                { method: ['byUserId', userId] },
                { method: ['byType', 'text'] },
                { method: ['byValue', 'True'] }
            ], transaction);

            const payload: IRuleData = {
                customer: {
                    id: userId,
                    attributes: userTags.map(userTag => userTag.key)
                },
                biomarkerResult: {
                    value: biomarkersList[i].lastResult.value,
                    range: RecommendationTypes[biomarkersList[i].lastResult.recommendationRange],
                    name: biomarkersList[i].name,
                    category: biomarkersList[i].category.name
                },
                recommendations: recommendations.map(recommendation => ({
                    id: recommendation.userRecommendation.id,
                    name: recommendation.title,
                    tag: recommendation.tag ? recommendation.tag.name : undefined,
                    category: recommendationCategoryToString[recommendation.category],
                })),
                form_response: typeformQuizDataWithoutHidden,
            };

            console.log(`biomarked id: ${biomarkersList[i].id} body ${JSON.stringify(payload)}`);

            const response = await this.solveRule(payload)
                .catch(err => {
                    console.log(`Error on biomarker id - ${biomarkersList[i].id}`);
                    isError = true;
                    //console.log(`Error: ${JSON.stringify(err)}`);
                    /*throw new UnprocessableEntityException({
                        message: err.message,
                        errorCode: 'DECISION_RULES_ERROR',
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                    });*/
                });

            console.log(`Rule solved for biomarker id - ${biomarkersList[i].id}`);

            results.push(response);
        }

        if (isError) {
            console.log('Error during rule solving');
            return;
        }

        console.log('Rules solved!');

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