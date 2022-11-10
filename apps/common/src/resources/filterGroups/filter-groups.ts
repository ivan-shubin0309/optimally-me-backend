import { RecommendationTypes } from '../recommendations/recommendation-types';
import { FilterGroupTypes } from './filter-group-types';

export const FilterGroups = {
    [FilterGroupTypes.low]: [
        RecommendationTypes.criticalLow,
        RecommendationTypes.low,
        RecommendationTypes.subOptimal,
    ],
    [FilterGroupTypes.high]: [
        RecommendationTypes.supraOptimal,
        RecommendationTypes.high,
        RecommendationTypes.criticalHigh,
    ]
};
