import { Inject, Injectable } from '@nestjs/common';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { Repository, Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { BaseService } from '../../common/src/base/base.service';
import { IUserResult, UserResult } from './models/user-result.entity';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { CreateUserResultDto } from './models/create-user-result.dto';
import { FilterRangeHelper } from '../../common/src/resources/filters/filter-range.helper';
import { FiltersService } from '../../biomarkers/src/services/filters/filters.service';
import { User } from '../../users/src/models';
import { AgeHelper } from '../../common/src/resources/filters/age.helper';
import { UsersService } from '../../users/src/users.service';
import { UserRoles } from '../../common/src/resources/users';
import { OtherFeatureTypes } from '../../common/src/resources/filters/other-feature-types';
import { SkinTypes } from '../../common/src/resources/filters/skin-types';

@Injectable()
export class AdminsResultsService extends BaseService<UserResult> {
    constructor(
        @Inject('USER_RESULT_MODEL') protected model: Repository<UserResult>,
        @Inject('RECOMMENDATION_MODEL') private readonly recommendationModel: Repository<Recommendation>,
        @Inject('USER_RECOMMENDATION_MODEL') private readonly userRecommendationModel: Repository<UserRecommendation>,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly filtersService: FiltersService,
        private readonly usersService: UsersService,
    ) { super(model); }

    create(body: IUserResult, transaction?: Transaction): Promise<UserResult> {
        return this.model.create({ ...body }, { transaction });
    }

    async bulkCreate(data: IUserResult[], transaction?: Transaction): Promise<UserResult[]> {
        return this.model.bulkCreate(data as any, { transaction });
    }

    async attachRecommendations(userResults: UserResult[], userId: number, transaction?: Transaction, options?: { isAnyRecommendation: boolean, skinType: SkinTypes }): Promise<void> {
        const userRecommendationsToCreate = [];
        const filteredUserResults = userResults.filter(userResult => userResult.filterId && userResult.recommendationRange);
        const scopes = [];

        if (!filteredUserResults.length) {
            return;
        }

        if (options?.isAnyRecommendation) {
            scopes.push({ method: ['byFilterId', filteredUserResults.map(userResult => userResult.filterId)] });
            if (options.skinType) {
                scopes.push({ method: ['bySkinType', options.skinType] });
            }
        } else {
            scopes.push({ method: ['byFilterIdAndType', filteredUserResults.map(userResult => ({ filterId: userResult.filterId, type: userResult.recommendationRange }))] });
        }

        const recommendations = await this.recommendationModel
            .scope(scopes)
            .findAll({ transaction });

        const userResultsMap = {};
        filteredUserResults.forEach(userResult => {
            userResultsMap[userResult.filterId] = userResult;
        });

        recommendations.forEach(recommendation => {
            recommendation.filterRecommendations.forEach(filterRecommendation => {
                if (userResultsMap[filterRecommendation.filterId]) {
                    userRecommendationsToCreate.push({
                        userId: userId,
                        recommendationId: recommendation.id,
                        userResultId: userResultsMap[filterRecommendation.filterId].id
                    });
                }
            });
        });

        await this.userRecommendationModel.bulkCreate(userRecommendationsToCreate, { transaction });

        if (recommendations.length) {
            await this.recommendationModel
                .scope([{ method: ['byId', recommendations.map(recommendation => recommendation.id)] }])
                .update({ isDeletable: false }, { transaction } as any);
        }
    }

    async dettachFilters(filterIds: number[], transaction?: Transaction): Promise<void> {
        await this.model
            .scope([{ method: ['byFilterId', filterIds] }])
            .update({ filterId: null }, { transaction } as any);
    }

    async createUserResults(results: CreateUserResultDto[], userId: User | number, biomarkerIds: number[], options?: { otherFeature: OtherFeatureTypes }): Promise<void> {
        let user;
        if (typeof userId === 'number') {
            user = await this.usersService.getOne([
                { method: ['byId', userId] },
                { method: ['byRoles', UserRoles.user] },
                'withAdditionalField'
            ]);
        } else {
            user = userId;
        }

        const specificUserFiltersMap = {};

        if (user.additionalField) {
            const specificUserFilters = await this.filtersService.getList([
                {
                    method: [
                        'byBiomarkerIdsAndCharacteristics',
                        biomarkerIds,
                        {
                            sexType: user.additionalField.sex,
                            ageTypes: user.additionalField.dateOfBirth && AgeHelper.getAgeRanges(user.additionalField.dateOfBirth),
                            ethnicityType: user.additionalField.ethnicity,
                            otherFeature: options?.otherFeature || user.additionalField.otherFeature
                        }
                    ]
                }
            ]);

            specificUserFilters.forEach(filter => {
                specificUserFiltersMap[filter.biomarkerId] = filter;
            });
        }

        const filtersAllMap = {};
        const filtersAll = await this.filtersService.getList([{ method: ['byBiomarkerIdAndAllFilter', biomarkerIds] }]);
        filtersAll.forEach(filter => {
            filtersAllMap[filter.biomarkerId] = filter;
        });

        const userResultsToCreate = results.map(result => {
            let activeFilter, filterId, recommendationRange, deviation;

            if (specificUserFiltersMap[result.biomarkerId]) {
                activeFilter = specificUserFiltersMap[result.biomarkerId];
            } else if (filtersAllMap[result.biomarkerId]) {
                activeFilter = filtersAllMap[result.biomarkerId];
            }

            if (activeFilter) {
                filterId = activeFilter.id;
                recommendationRange = FilterRangeHelper.getRecommendationTypeByValue(activeFilter, result.value);
            }

            if (recommendationRange) {
                deviation = FilterRangeHelper.calculateDeviation(activeFilter, recommendationRange, result.value);
            }

            return Object.assign({ userId: user.id, filterId, recommendationRange, deviation }, result);
        });

        const createdResults = await this.bulkCreate(userResultsToCreate);

        await this.attachRecommendations(createdResults, user.id);
    }
}
