import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { FilterBulletList } from '../../models/filterBulletLists/filter-bullet-list.entity';
import { Filter } from '../../models/filters/filter.entity';
import { FilterRecommendation } from '../../models/recommendations/filter-recommendation.entity';
import { UpdateFilterDataDto } from '../../models/filters/update-filter-data.dto';
import { BiomarkersFactory } from '../../biomarkers.factory';
import { IUpdateFilter } from '../../models/create-biomarker.interface';
import { UserResult } from '../../../../admins-results/src/models/user-result.entity';

interface IFilterGetListOptions {
    readonly isIncludeAll: boolean,
}

@Injectable()
export class FiltersService extends BaseService<Filter> {
    constructor(
        @Inject('FILTER_MODEL') protected model: Repository<Filter>,
        @Inject('FILTER_RECOMMENDATION_MODEL') protected filterRecommendationModel: Repository<FilterRecommendation>,
        @Inject('FILTER_BULLET_LIST_MODEL') readonly filterBulletListModel: Repository<FilterBulletList>,
        @Inject('USER_RESULT_MODEL') protected userResultModel: Repository<UserResult>,
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

    async getOne(scopes?: any[], transaction?: Transaction, options: IFilterGetListOptions = { isIncludeAll: false }): Promise<Filter> {
        const filterScopes = [...scopes];

        if (options.isIncludeAll) {
            filterScopes.push('includeAll');
        }

        const filter = await super.getOne(filterScopes, transaction);

        if (filter && options.isIncludeAll) {
            const [recommendationsList, bulletLists] = await Promise.all([
                this.filterRecommendationModel
                    .scope([{ method: ['byFilterId', filter.id] }, 'includeAll'])
                    .findAll({ transaction }),
                this.filterBulletListModel
                    .scope([{ method: ['byFilterId', filter.id] }, 'withStudyLinks'])
                    .findAll({ transaction }),
            ]);

            filter.setDataValue('filterRecommendations', recommendationsList);
            filter.filterRecommendations = recommendationsList;

            filter.setDataValue('bulletList', bulletLists);
            filter.bulletList = bulletLists;
        }

        return filter;
    }

    async joinBulletList(filter: Filter, transaction?: Transaction): Promise<void> {
        const bulletLists = await this.filterBulletListModel
            .scope([{ method: ['byFilterId', filter.id] }, 'withStudyLinks'])
            .findAll({ transaction });


        filter.setDataValue('bulletList', bulletLists);
        filter.bulletList = bulletLists;
    }

    async update(filters: IUpdateFilter[], biomarkerId: number, biomarkerFactory: BiomarkersFactory, transaction?: Transaction): Promise<void> {
        const filtersToCreate = [], filtersToUpdate = [], filterResultCountersMap = {};

        filters.forEach(filter => {
            if (filter.id) {
                filtersToUpdate.push(filter);
            } else {
                filtersToCreate.push(filter);
            }
        });

        const filterResultCounters: any[] = await this.userResultModel
            .scope([
                { method: ['byFilterId', filtersToUpdate.map(filterToUpdate => filterToUpdate.id)] },
                { method: ['filterCount'] }
            ])
            .findAll({ transaction });

        filterResultCounters.forEach(filterCounter => {
            filterResultCountersMap[filterCounter.filterId] = filterCounter;
        });

        await this.model
            .scope([{ method: ['byBiomarkerId', biomarkerId] }])
            .update({ biomarkerId: null, removedFromBiomarkerId: biomarkerId }, { transaction } as any);

        const promises = filtersToCreate.map(filter => biomarkerFactory.attachFilter(filter, biomarkerId, transaction));

        promises.push(
            ...filtersToUpdate.map(async (filterToUpdate) => {
                if (filterResultCountersMap[filterToUpdate.id] && filterResultCountersMap[filterToUpdate.id].get('counter')) {
                    await biomarkerFactory.attachFilter(filterToUpdate, biomarkerId, transaction);
                } else {
                    await biomarkerFactory.dettachAllFromFilter(filterToUpdate.id, transaction);

                    await Promise.all([
                        this.model
                            .scope([{ method: ['byId', filterToUpdate.id] }])
                            .update(new UpdateFilterDataDto(filterToUpdate, biomarkerId), { transaction } as any),
                        biomarkerFactory.attachAllToFilter(filterToUpdate, filterToUpdate.id, transaction),
                    ]);
                }
            })
        );

        await Promise.all(promises);
    }
}