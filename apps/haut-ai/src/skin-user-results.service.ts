import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Sequelize, Transaction } from 'sequelize/types';
import { ISkinUserResult, SkinUserResult } from './models/skin-user-result.entity';
import { HautAiMetricTypes, techNamesToMetricTypes } from '../../common/src/resources/haut-ai/haut-ai-metric-types';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { IUserResult, UserResult } from '../../admins-results/src/models/user-result.entity';
import { SkinUserResultStatuses } from '../../common/src/resources/haut-ai/skin-user-result-statuses';
import { FilterRangeHelper } from '../../common/src/resources/filters/filter-range.helper';

@Injectable()
export class SkinUserResultsService extends BaseService<SkinUserResult> {
    constructor(
        @Inject('SKIN_USER_RESULT_MODEL') protected model: Repository<SkinUserResult>,
        @Inject('BIOMARKER_MODEL') private biomarkerModel: Repository<Biomarker>,
        @Inject('SEQUELIZE') private dbConnection: Sequelize,
        @Inject('USER_RESULT_MODEL') private userResultModel: Repository<UserResult>,
    ) { super(model); }

    create(body: ISkinUserResult, transaction?: Transaction): Promise<SkinUserResult> {
        return this.model.create(body as any, { transaction });
    }

    async saveResults(results: any[], skinResult: SkinUserResult, userId: number): Promise<void> {
        const filteredResults = results
            .filter(result => !!techNamesToMetricTypes[result?.result?.algorithm_tech_name])
            .map(result => ({
                type: techNamesToMetricTypes[result?.result?.algorithm_tech_name],
                value: result?.result?.area_results[0]?.main_metric?.value
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
            let itaResult;

            filteredResults.forEach((result: { value: number, type: HautAiMetricTypes }) => {
                if (result.type === HautAiMetricTypes.ita) {
                    itaResult = result;
                    return;
                }

                const skinBiomarkersByType = skinBiomarkersMapByType[result.type];
                if (skinBiomarkersByType?.length) {
                    skinBiomarkersByType.forEach(skinBiomarkerByType => {
                        if (!skinBiomarkerByType.filters[0]) {
                            return;
                        }
                        resultsToCreate.push({
                            skinUserResultId: skinResult.id,
                            filterId: skinBiomarkerByType.filters[0].id,
                            biomarkerId: skinBiomarkerByType.id,
                            userId,
                            value: result.value,
                            recommendationRange: FilterRangeHelper.getRecommendationTypeByValue(skinBiomarkerByType.filters[0], result.value),
                            date: 
                        });
                    });
                }
            });

            await skinResult.update({ itaScore: itaResult.value, status: SkinUserResultStatuses.loaded }, { transaction });

            await this.userResultModel.bulkCreate(resultsToCreate, { transaction });
        });
    }
}