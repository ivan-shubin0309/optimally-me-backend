import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { Filter } from '../../models/filters/filter.entity';
import { FilterRecommendation } from '../../models/recommendations/filter-recommendation.entity';

interface IFilterGetListOptions {
    readonly isIncludeAll: boolean,
}

@Injectable()
export class FiltersService extends BaseService<Filter> {
    constructor(
        @Inject('FILTER_MODEL') protected model: Repository<Filter>,
        @Inject('FILTER_RECOMMENDATION_MODEL') protected filterRecommendationModel: Repository<FilterRecommendation>,
    ) { super(model); }

    async removeByBiomarkerId(biomarkerId: number, transaction?: Transaction): Promise<void> {
        await this.model
            .scope([{ method: ['byBiomarkerId', biomarkerId] }])
            .destroy({ transaction });
    }

    async getList(scopes: any[], transaction?: Transaction, options: IFilterGetListOptions = { isIncludeAll: false }): Promise<Filter[]> {
        const filterScopes = [...scopes];
        const recommendationsMap = {};

        if (options.isIncludeAll) {
            filterScopes.push('includeAll');
        }

        const filters = await super.getList(filterScopes, transaction);

        if (filters.length && options.isIncludeAll) {
            const recommendationsList = await this.filterRecommendationModel
                .scope([{ method: ['byFilterId', filters.map(filter => filter.id)] }, 'includeAll'])
                .findAll({ transaction });

            recommendationsList.forEach(filterRecommendation => {
                if (!recommendationsMap[filterRecommendation.filterId]) {
                    recommendationsMap[filterRecommendation.filterId] = [];
                }

                recommendationsMap[filterRecommendation.filterId].push(filterRecommendation);
            });

            filters.forEach(filter => {
                filter.setDataValue('filterRecommendations', recommendationsMap[filter.id]);
                filter.filterRecommendations = recommendationsMap[filter.id];
            });
        }

        return filters;
    }
}