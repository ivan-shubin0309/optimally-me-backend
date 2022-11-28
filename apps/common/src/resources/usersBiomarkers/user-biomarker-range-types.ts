import { RecommendationTypes } from '../recommendations/recommendation-types';
import { BASE_DEVIATION_STEP } from './constants';

export enum UserBiomarkerRangeTypes {
    critical = 1,
    bad = 2,
    borderline = 3,
    optimal = 4
}

export const recommendationTypesToRangeTypes = {
    [RecommendationTypes.criticalLow]: UserBiomarkerRangeTypes.critical,
    [RecommendationTypes.criticalHigh]: UserBiomarkerRangeTypes.critical,
    [RecommendationTypes.high]: UserBiomarkerRangeTypes.bad,
    [RecommendationTypes.low]: UserBiomarkerRangeTypes.bad,
    [RecommendationTypes.subOptimal]: UserBiomarkerRangeTypes.borderline,
    [RecommendationTypes.supraOptimal]: UserBiomarkerRangeTypes.borderline,
};

export const baseDeviation = {
    [RecommendationTypes.criticalLow]: BASE_DEVIATION_STEP * 3,
    [RecommendationTypes.criticalHigh]: BASE_DEVIATION_STEP * 3,
    [RecommendationTypes.high]: BASE_DEVIATION_STEP * 2,
    [RecommendationTypes.low]: BASE_DEVIATION_STEP * 2,
    [RecommendationTypes.subOptimal]: BASE_DEVIATION_STEP,
    [RecommendationTypes.supraOptimal]: BASE_DEVIATION_STEP,
};