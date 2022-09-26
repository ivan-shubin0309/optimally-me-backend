import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import {
    FilterRecommendation,
    ICreateFilterRecommendation,
    ICreateLibraryFilterRecommendation,
    LibraryFilterRecommendation
} from '../../../../biomarkers/src/models';
import { CreateParamsHelper } from '../../../../common/src/utils/helpers/create-params.helper';
import { RecommendationCategoryTypes } from './recommendation-category-types';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly createParamsHelper: CreateParamsHelper,
    @Inject('FILTER_RECOMMENDATION_MODEL') private readonly filterRecommendationsModel: Repository<FilterRecommendation>,
    @Inject('LIBRARY_FILTER_RECOMMENDATION_MODEL') private readonly libraryFilterRecommendationModel: Repository<LibraryFilterRecommendation>
  ) {}

  async createFilterRecommendations(filter, filterId, biomarkerId): Promise<void> {
    let filterRecommendationParam;
    if(filter.recommendations.criticalLow.length !== 0) {
        for await (const element of filter.recommendations.criticalLow ) {
            filterRecommendationParam = await this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationCategoryTypes.criticalLow);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
    if(filter.recommendations.criticalHigh.length !== 0) {
        for await (const element of filter.recommendations.criticalHigh ) {
            filterRecommendationParam = this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationCategoryTypes.criticalHigh);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
    if(filter.recommendations.high.length !== 0) {
        for await (const element of filter.recommendations.high ) {
            filterRecommendationParam = this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationCategoryTypes.high);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
    if(filter.recommendations.low.length !== 0) {
        for await (const element of filter.recommendations.low ) {
            filterRecommendationParam = this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationCategoryTypes.low);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
}

async createLibraryFilterRecommendations(filter, filterId): Promise<void>{
    let filterLibraryRecommendationParam;
    if(filter.recommendations.criticalLow.length !== 0) {
        for await (const element of filter.recommendations.criticalLow ) {
            filterLibraryRecommendationParam = await this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationCategoryTypes.criticalLow);
            await this.createFilterLibraryRecommendation(filterLibraryRecommendationParam);
        }
    }
    if(filter.recommendations.criticalHigh.length !== 0) {
        for await (const element of filter.recommendations.criticalHigh ) {
            filterLibraryRecommendationParam = this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationCategoryTypes.criticalHigh);
            await this.createFilterLibraryRecommendation(filterLibraryRecommendationParam);
        }
    }
    if(filter.recommendations.high.length !== 0) {
        for await (const element of filter.recommendations.high ) {
            filterLibraryRecommendationParam = this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationCategoryTypes.high);
            await this.createFilterLibraryRecommendation(filterLibraryRecommendationParam);
        }
    }
    if(filter.recommendations.low.length !== 0) {
        for await (const element of filter.recommendations.low ) {
            filterLibraryRecommendationParam = this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationCategoryTypes.low);
            await this.createFilterLibraryRecommendation(filterLibraryRecommendationParam);
        }
    }
}

  createFilterRecommendation(body: ICreateFilterRecommendation):  Promise<FilterRecommendation> {
    return this.filterRecommendationsModel.create({ ...body });
  }

  createFilterLibraryRecommendation(body: ICreateLibraryFilterRecommendation):  Promise<LibraryFilterRecommendation> {
    return this.libraryFilterRecommendationModel.create({ ...body });
  }
}