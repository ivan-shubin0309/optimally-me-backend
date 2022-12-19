import { Filter } from '../../../../biomarkers/src/models/filters/filter.entity';
import { RecommendationTypes } from '../recommendations/recommendation-types';

export class FilterRangeHelper {
    static getRecommendationTypeByValue(filter: Filter, value: number): RecommendationTypes {
        if (typeof filter.optimalMin === 'number'
            && typeof filter.optimalMax === 'number'
            && filter.optimalMin <= value
            && filter.optimalMax >= value) {
            return RecommendationTypes.optimal;
        }

        if (filter.optimalMin > value) {
            if (typeof filter.criticalLow === 'number' && filter.criticalLow >= value) {
                return RecommendationTypes.criticalLow;
            }

            if (typeof filter.lowMax === 'number' && filter.lowMax >= value) {
                return RecommendationTypes.low;
            }

            if (typeof filter.subOptimalMax === 'number' && filter.subOptimalMax >= value) {
                return RecommendationTypes.subOptimal;
            }
        }

        if (filter.optimalMax < value) {
            if (typeof filter.criticalHigh === 'number' && filter.criticalHigh <= value) {
                return RecommendationTypes.criticalHigh;
            }

            if (typeof filter.highMin === 'number' && filter.highMin <= value) {
                return RecommendationTypes.high;
            }

            if (typeof filter.subOptimalMin === 'number' && filter.supraOptimalMin <= value) {
                return RecommendationTypes.supraOptimal;
            }
        }

        return null;
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