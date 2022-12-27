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

            if (typeof filter.supraOptimalMin === 'number' && filter.supraOptimalMin <= value) {
                return RecommendationTypes.supraOptimal;
            }
        }

        return null;
    }

    static calculateDeviation(filter: Filter, recommendationRange: RecommendationTypes, value: number): number {
        if (recommendationRange === RecommendationTypes.optimal) {
            return 0;
        }

        if (recommendationRange === RecommendationTypes.subOptimal || recommendationRange === RecommendationTypes.supraOptimal) {
            const optimalAvg = (filter.optimalMin + filter.optimalMax) / 2;
            return value > optimalAvg
                ? (value - optimalAvg) / optimalAvg * 100
                : (optimalAvg - value) / optimalAvg * 100;
        }

        if (recommendationRange > RecommendationTypes.optimal) {
            return (value - filter.optimalMax) / filter.optimalMax * 100;
        } else {
            return (filter.optimalMin - value) / filter.optimalMin * 100;
        }
    }
}