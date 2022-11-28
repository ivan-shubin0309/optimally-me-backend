import { Filter } from '../../../../biomarkers/src/models/filters/filter.entity';
import { EnumHelper } from '../../utils/helpers/enum.helper';
import { RecommendationTypes } from '../recommendations/recommendation-types';

export class FilterRangeHelper {
    static getRecommendationTypeByValue(filter: Filter, value: number): RecommendationTypes {
        const result = EnumHelper
            .toCollection(RecommendationTypes)
            .find((recommendationType) => {
                if (
                    recommendationType.value === RecommendationTypes.criticalLow
                    && typeof filter[recommendationType.key] === 'number'
                    && filter[recommendationType.key] >= value
                ) {
                    return recommendationType.value;
                }

                if (
                    recommendationType.value === RecommendationTypes.criticalHigh
                    && typeof filter[recommendationType.key] === 'number'
                    && filter[recommendationType.key] <= value
                ) {
                    return recommendationType.value;
                }

                if (
                    recommendationType.value !== RecommendationTypes.criticalHigh
                    && recommendationType.value !== RecommendationTypes.criticalLow
                    && typeof filter[`${recommendationType.key}Min`] === 'number'
                    && typeof filter[`${recommendationType.key}Max`] === 'number'
                    && filter[`${recommendationType.key}Min`] <= value
                    && filter[`${recommendationType.key}Max`] >= value
                ) {
                    return recommendationType.value;
                }
            });
        return result && result.value;
    }

    static calculateDeviation(filter: Filter, recommendationRange: RecommendationTypes, value: number): number {
        let higherValue, lowerValue;

        if (recommendationRange === RecommendationTypes.optimal) {
            const avgOptimal = (filter.optimalMax + filter.optimalMin) / 2;
            higherValue = avgOptimal > value
                ? avgOptimal
                : value;
            lowerValue = avgOptimal < value
                ? avgOptimal
                : value;
        } else if (recommendationRange > RecommendationTypes.optimal) {
            higherValue = value;
            lowerValue = filter.optimalMax;
        } else {
            higherValue = filter.optimalMin;
            lowerValue = value;
        }

        return (higherValue - lowerValue) / higherValue * 100;
    }
}