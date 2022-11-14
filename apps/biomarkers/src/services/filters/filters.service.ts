import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { FilterBulletList } from '../../models/filterBulletLists/filter-bullet-list.entity';
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
        @Inject('FILTER_BULLET_LIST_MODEL') readonly filterBulletListModel: Repository<FilterBulletList>,
    ) { super(model); }

    async removeByBiomarkerId(biomarkerId: number, transaction?: Transaction): Promise<void> {
        await this.model
            .scope([{ method: ['byBiomarkerId', biomarkerId] }])
            .destroy({ transaction });
    }

    async getList(scopes: any[], transaction?: Transaction, options: IFilterGetListOptions = { isIncludeAll: false }): Promise<Filter[]> {
        const filterScopes = [...scopes];
        const recommendationsMap = {}, bulletListsMap = {};

        if (options.isIncludeAll) {
            filterScopes.push('includeAll');
        }

        const filters = await super.getList(filterScopes, transaction);

        if (filters.length && options.isIncludeAll) {
            const filterIds = filters.map(filter => filter.id);
            const [recommendationsList, bulletLists] = await Promise.all([
                this.filterRecommendationModel
                    .scope([{ method: ['byFilterId', filterIds] }, 'includeAll'])
                    .findAll({ transaction }),
                this.filterBulletListModel
                    .scope([{ method: ['byFilterId', filterIds] }, 'withStudyLinks'])
                    .findAll({ transaction }),
            ]);

            recommendationsList.forEach(filterRecommendation => {
                if (!recommendationsMap[filterRecommendation.filterId]) {
                    recommendationsMap[filterRecommendation.filterId] = [];
                }

                recommendationsMap[filterRecommendation.filterId].push(filterRecommendation);
            });

            bulletLists.forEach(bulletList => {
                if (!bulletListsMap[bulletList.filterId]) {
                    bulletListsMap[bulletList.filterId] = [];
                }

                bulletListsMap[bulletList.filterId].push(bulletList);
            });

            filters.forEach(filter => {
                filter.setDataValue('filterRecommendations', recommendationsMap[filter.id]);
                filter.filterRecommendations = recommendationsMap[filter.id];

                filter.setDataValue('bulletList', bulletListsMap[filter.id]);
                filter.bulletList = bulletListsMap[filter.id];
            });
        }

        return filters;
    }
}