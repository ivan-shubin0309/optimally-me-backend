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

export enum UserBiomarkerSkinRangeTypes {
    poor = 1,
    canDoBetter = 2,
    scopeToImprove = 3,
    good = 4,
    great = 5,
    optimal = 6
}

export const recommendationTypesToSkinRangeTypes = {
    [RecommendationTypes.criticalLow]: UserBiomarkerSkinRangeTypes.poor,
    [RecommendationTypes.low]: UserBiomarkerSkinRangeTypes.canDoBetter,
    [RecommendationTypes.subOptimal]: UserBiomarkerSkinRangeTypes.scopeToImprove,
    [RecommendationTypes.supraOptimal]: UserBiomarkerSkinRangeTypes.good,
    [RecommendationTypes.high]: UserBiomarkerSkinRangeTypes.great,
    [RecommendationTypes.criticalHigh]: UserBiomarkerSkinRangeTypes.optimal,
};