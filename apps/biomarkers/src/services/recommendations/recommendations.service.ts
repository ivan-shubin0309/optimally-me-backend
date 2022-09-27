import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import {
    FilterRecommendation,
    ICreateFilterRecommendation,
    ICreateLibraryFilterRecommendation,
    LibraryFilterRecommendation,
    Recommendation
} from '../../../../biomarkers/src/models';
import { CreateParamsHelper } from '../../../../common/src/utils/helpers/create-params.helper';
import { RecommendationRangeTypes } from './recommendation-range-types';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly createParamsHelper: CreateParamsHelper,
    @Inject('FILTER_RECOMMENDATION_MODEL') private readonly filterRecommendationsModel: Repository<FilterRecommendation>,
    @Inject('LIBRARY_FILTER_RECOMMENDATION_MODEL') private readonly libraryFilterRecommendationModel: Repository<LibraryFilterRecommendation>,
    @Inject('RECOMMENDATION_MODEL') private readonly recommendationModel: Repository<Recommendation>
  ) {}

  async createFilterRecommendations(filter, filterId, biomarkerId): Promise<void> {
    let filterRecommendationParam;
    if(filter.recommendations.criticalLow.length !== 0) {
        for await (const element of filter.recommendations.criticalLow ) {
            filterRecommendationParam = await this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationRangeTypes.criticalLow);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
    if(filter.recommendations.criticalHigh.length !== 0) {
        for await (const element of filter.recommendations.criticalHigh ) {
            filterRecommendationParam = this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationRangeTypes.criticalHigh);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
    if(filter.recommendations.high.length !== 0) {
        for await (const element of filter.recommendations.high ) {
            filterRecommendationParam = this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationRangeTypes.high);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
    if(filter.recommendations.low.length !== 0) {
        for await (const element of filter.recommendations.low ) {
            filterRecommendationParam = this.createParamsHelper.createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, RecommendationRangeTypes.low);
            await this.createFilterRecommendation(filterRecommendationParam);
        }
    }
}

async createLibraryFilterRecommendations(filter, filterId): Promise<void>{
    let filterLibraryRecommendationParam;
    if(filter.recommendations.criticalLow.length !== 0) {
        for await (const element of filter.recommendations.criticalLow ) {
            filterLibraryRecommendationParam = await this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationRangeTypes.criticalLow);
            await this.createFilterLibraryRecommendation(filterLibraryRecommendationParam);
        }
    }
    if(filter.recommendations.criticalHigh.length !== 0) {
        for await (const element of filter.recommendations.criticalHigh ) {
            filterLibraryRecommendationParam = this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationRangeTypes.criticalHigh);
            await this.createFilterLibraryRecommendation(filterLibraryRecommendationParam);
        }
    }
    if(filter.recommendations.high.length !== 0) {
        for await (const element of filter.recommendations.high ) {
            filterLibraryRecommendationParam = this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationRangeTypes.high);
            await this.createFilterLibraryRecommendation(filterLibraryRecommendationParam);
        }
    }
    if(filter.recommendations.low.length !== 0) {
        for await (const element of filter.recommendations.low ) {
            filterLibraryRecommendationParam = this.createParamsHelper.createParamsForRecommendationLibraryFilter(element, filterId, RecommendationRangeTypes.low);
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

  getListRecommendations(scopes = []):  Promise<Recommendation[]> {
    return this.recommendationModel
      .scope(scopes)
      .findAll();
  }

  getRecommendationsCount(scopes = []):  Promise<number> {
    return this.recommendationModel
      .scope(scopes)
      .count();
  }
}