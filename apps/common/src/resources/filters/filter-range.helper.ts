import { Filter } from '../../../../biomarkers/src/models/filters/filter.entity';
import { RecommendationTypes } from '../recommendations/recommendation-types';

export class FilterRangeHelper {
    static getRecommendationTypeByValue(filter: Filter, value: number): RecommendationTypes {
        if (typeof filter.get('optimalMin') === 'number'
            && typeof filter.get('optimalMax') === 'number'
            && filter.get('optimalMin') <= value
            && filter.get('optimalMax') >= value) {
            return RecommendationTypes.optimal;
        }

        if (filter.get('optimalMin') > value) {
            if (typeof filter.get('criticalLow') === 'number' && filter.get('criticalLow') >= value) {
                return RecommendationTypes.criticalLow;
            }

            if (typeof filter.get('lowMax') === 'number' && filter.get('lowMax') >= value) {
                return RecommendationTypes.low;
            }

            if (typeof filter.get('subOptimalMax') === 'number' && filter.get('subOptimalMax') >= value) {
                return RecommendationTypes.subOptimal;
            }
        }

        if (filter.get('optimalMax') < value) {
            if (typeof filter.get('criticalHigh') === 'number' && filter.get('criticalHigh') <= value) {
                return RecommendationTypes.criticalHigh;
            }

            if (typeof filter.get('highMin') === 'number' && filter.get('highMin') <= value) {
                return RecommendationTypes.high;
            }

            if (typeof filter.get('supraOptimalMin') === 'number' && filter.get('supraOptimalMin') <= value) {
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
            const optimalAvg = (filter.get('optimalMin') + filter.get('optimalMax')) / 2;
            return value > optimalAvg
                ? (value - optimalAvg) / optimalAvg * 100
                : (optimalAvg - value) / optimalAvg * 100;
        }

        if (recommendationRange > RecommendationTypes.optimal) {
            return (value - filter.get('optimalMax')) / filter.get('optimalMax') * 100;
        } else {
            return (filter.get('optimalMin') - value) / filter.get('optimalMin') * 100;
        }
    }
}