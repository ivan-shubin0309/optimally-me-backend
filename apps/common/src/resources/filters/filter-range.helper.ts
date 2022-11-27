import { Filter } from '../../../../biomarkers/src/models/filters/filter.entity';
import { EnumHelper } from '../../utils/helpers/enum.helper';
import { RecommendationTypes } from '../recommendations/recommendation-types';
import { BASE_DEVIATION_STEP } from '../usersBiomarkers/constants';
import { baseDeviation } from '../usersBiomarkers/user-biomarker-range-types';

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
        if (recommendationRange === RecommendationTypes.optimal) {
            return 0;
        }
        let deviation = baseDeviation[recommendationRange];

        if (recommendationRange === RecommendationTypes.criticalLow) {
            deviation += (1 - (value / filter[`${RecommendationTypes[recommendationRange]}`])) * BASE_DEVIATION_STEP;
        }

        if (recommendationRange === RecommendationTypes.criticalHigh) {
            deviation += ((value / filter[`${RecommendationTypes[recommendationRange]}`]) - 1) * BASE_DEVIATION_STEP;
        }

        if (recommendationRange > RecommendationTypes.optimal) {
            deviation += (value - filter[`${RecommendationTypes[recommendationRange]}Min`])
                / (filter[`${RecommendationTypes[recommendationRange]}Max`] - filter[`${RecommendationTypes[recommendationRange]}Min`])
                * BASE_DEVIATION_STEP;
        } else {
            deviation += (filter[`${RecommendationTypes[recommendationRange]}Max`] - value)
                / (filter[`${RecommendationTypes[recommendationRange]}Max`] - filter[`${RecommendationTypes[recommendationRange]}Min`])
                * BASE_DEVIATION_STEP;
        }

        return deviation;
    }
}