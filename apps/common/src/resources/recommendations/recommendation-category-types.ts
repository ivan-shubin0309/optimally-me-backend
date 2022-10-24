import { EnumHelper } from '../../utils/helpers/enum.helper';

export enum RecommendationCategoryTypes {
    diet = 1,
    lifestyle = 2,
    supplements = 3,
    doctor = 4,
    tests = 5
}

export const recommendationCategoryOrder = EnumHelper
    .toOrderByKeys(RecommendationCategoryTypes)
    .map(obj => obj.value);