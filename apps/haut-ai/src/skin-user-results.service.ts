import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';
import { ISkinUserResult, SkinUserResult } from './models/skin-user-result.entity';
import { EYES_AGE_METRIC, HautAiMetricTypes, ITA_SCORE_METRIC, PERCEIVED_AGE_METRIC, techNamesToMetricTypes } from '../../common/src/resources/haut-ai/haut-ai-metric-types';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { IUserResult, UserResult } from '../../admins-results/src/models/user-result.entity';
import { SkinUserResultStatuses } from '../../common/src/resources/haut-ai/skin-user-result-statuses';
import { FilterRangeHelper } from '../../common/src/resources/filters/filter-range.helper';
import { DateTime } from 'luxon';
import { AdminsResultsService } from '../../admins-results/src/admins-results.service';
import { TypeformService } from '../../typeform/src/typeform.service';
import { UserQuizesService } from '../../typeform/src/user-quizes.service';
import { DecisionRulesService } from 'apps/typeform/src/decision-rules.service';

@Injectable()
export class SkinUserResultsService extends BaseService<SkinUserResult> {
    constructor(
        @Inject('SKIN_USER_RESULT_MODEL') protected model: Repository<SkinUserResult>,
        @Inject('BIOMARKER_MODEL') private biomarkerModel: Repository<Biomarker>,
        @Inject('SEQUELIZE') private dbConnection: Sequelize,
        @Inject('USER_RESULT_MODEL') private userResultModel: Repository<UserResult>,
        private readonly adminsResultsService: AdminsResultsService,
        private readonly typeformService: TypeformService,
        private readonly userQuizesService: UserQuizesService,
        private readonly decisionRulesService: DecisionRulesService,
    ) { super(model); }

    create(body: ISkinUserResult, transaction?: Transaction): Promise<SkinUserResult> {
        return this.model.create(body as any, { transaction });
    }

    async saveResults(results: any[], skinResult: SkinUserResult, userId: number): Promise<void> {
        const filteredResults: { value: number, type: HautAiMetricTypes | string, createdAt: string }[] = results
            .filter(result => !!techNamesToMetricTypes[result?.result?.algorithm_tech_name])
            .map(result => ({
                type: techNamesToMetricTypes[result?.result?.algorithm_tech_name],
                value: result?.result?.area_results[0]?.main_metric?.value,
                createdAt: result.creation_time,
            }));

        const skinBiomarkers = await this.biomarkerModel
            .scope([
                { method: ['byType', BiomarkerTypes.skin] },
                { method: ['byIsDeleted', false] },
                { method: ['byIsActive', true] },
                'withFilters'
            ])
            .findAll({});

        const skinBiomarkersMapByType = {};
        skinBiomarkers.forEach(skinBiomarker => {
            if (!skinBiomarkersMapByType[skinBiomarker.hautAiMetricType]) {
                skinBiomarkersMapByType[skinBiomarker.hautAiMetricType] = [];
            }

            skinBiomarkersMapByType[skinBiomarker.hautAiMetricType].push(skinBiomarker);
        });

        await this.dbConnection.transaction(async transaction => {
            const resultsToCreate: IUserResult[] = [];
            let itaResult, perceivedAge, eyesAge;

            filteredResults.forEach(result => {
                if (result.type === ITA_SCORE_METRIC) {
                    itaResult = result;
                    return;
                }

                if (result.type === PERCEIVED_AGE_METRIC) {
                    perceivedAge = result;
                    return;
                }

                if (result.type === EYES_AGE_METRIC) {
                    eyesAge = result;
                    return;
                }

                const skinBiomarkersByType = skinBiomarkersMapByType[result.type];
                if (skinBiomarkersByType?.length) {
                    skinBiomarkersByType.forEach(skinBiomarkerByType => {
                        if (!skinBiomarkerByType.filters[0]) {
                            return;
                        }
                        const creationDate = DateTime.fromFormat(result.createdAt, 'yyyy-MM-dd HH:mm:ss');
                        resultsToCreate.push({
                            skinUserResultId: skinResult.id,
                            filterId: skinBiomarkerByType.filters[0].id,
                            biomarkerId: skinBiomarkerByType.id,
                            userId,
                            value: result.value,
                            recommendationRange: FilterRangeHelper.getRecommendationTypeByValue(skinBiomarkerByType.filters[0], result.value),
                            date: creationDate.toFormat('yyyy-MM-dd'),
                            createdAt: creationDate.toISO(),
                        });
                    });
                }
            });

            await skinResult.update(
                {
                    itaScore: itaResult.value,
                    perceivedAge: perceivedAge.value,
                    eyesAge: eyesAge.value,
                    status: SkinUserResultStatuses.loaded,
                },
                { transaction }
            );

            const createdResults = await this.userResultModel.bulkCreate(resultsToCreate as any, { transaction });

            await this.adminsResultsService.attachRecommendations(createdResults, userId, transaction, { isAnyRecommendation: true });

            const lastSensitiveSkinQuiz = await this.userQuizesService.getOne(
                [
                    { method: ['byUserId', userId] },
                    { method: ['orderBy', [['submittedAt', 'desc']]] }
                ],
                transaction
            );
            if (lastSensitiveSkinQuiz) {
                const formResponse = await this.typeformService.getFormResponse(lastSensitiveSkinQuiz);
                await this.decisionRulesService.updateUserRecommendations(userId, formResponse, transaction);
            }
        });
    }
}