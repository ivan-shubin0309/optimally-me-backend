import { RecommendationTypes } from '../recommendations/recommendation-types';

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
    [RecommendationTypes.optimal]: UserBiomarkerRangeTypes.optimal,
};