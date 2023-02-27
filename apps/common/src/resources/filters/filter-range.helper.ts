import { Filter } from '../../../../biomarkers/src/models/filters/filter.entity';
import { EnumHelper } from '../../utils/helpers/enum.helper';
import { RecommendationTypes } from '../recommendations/recommendation-types';

export class FilterRangeHelper {
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

    static getRecommendationTypeByValue(filter: Filter, value: number): RecommendationTypes {
        const ranges: { min: number, max: number, type: RecommendationTypes }[] = [];

        EnumHelper
            .toCollection(RecommendationTypes)
            .forEach(recommendationType => {
                if (recommendationType.value === RecommendationTypes.criticalLow && filter.get('criticalLow')) {
                    return ranges.push({
                        max: filter.get('criticalLow'),
                        min: -Infinity,
                        type: RecommendationTypes.criticalLow
                    });
                }

                if (recommendationType.value === RecommendationTypes.criticalHigh && filter.get('criticalHigh')) {
                    return ranges.push({
                        max: Infinity,
                        min: filter.get('criticalHigh'),
                        type: RecommendationTypes.criticalHigh
                    });
                }

                const range: any = { type: recommendationType.value };

                if (filter[`${recommendationType.key}Min`]) {
                    range.min = filter.get(`${recommendationType.key}Min`);
                }

                if (filter[`${recommendationType.key}Max`]) {
                    range.max = filter.get(`${recommendationType.key}Max`);
                }

                if (range.max || range.min) {
                    ranges.push(range);
                }
            });

        if (ranges.length && !ranges[0].min) {
            ranges[0].min = -Infinity;
        }
        if (ranges.length && !ranges[ranges.length - 1].max) {
            ranges[ranges.length - 1].max = Infinity;
        }

        ranges.forEach((range, index, arr) => {
            if (!range.min && arr[index - 1]?.max) {
                range.min = arr[index - 1]?.max;
            }
            if (!range.max && arr[index + 1]?.min) {
                range.max = arr[index + 1]?.min;
            }
        });

        const resultRange = ranges.find(range => value > range.min && value <= range.max);

        return resultRange && resultRange.type;
    }
}