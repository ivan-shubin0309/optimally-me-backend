import { EnumHelper } from '../../utils/helpers/enum.helper';

export enum RecommendationCategoryTypes {
    diet = 1,
    lifestyle = 2,
    supplements = 3,
    doctor = 4,
    tests = 5,
    information = 6,
    skinProduct = 7,
    diy = 8,
    atHomeDevice = 9,
}

export const recommendationCategoryToString = {
    [RecommendationCategoryTypes.diet]: 'diet',
    [RecommendationCategoryTypes.lifestyle]: 'lifestyle',
    [RecommendationCategoryTypes.supplements]: 'supplements',
    [RecommendationCategoryTypes.doctor]: 'doctor',
    [RecommendationCategoryTypes.tests]: 'tests',
    [RecommendationCategoryTypes.information]: 'information',
    [RecommendationCategoryTypes.skinProduct]: 'skin Product',
    [RecommendationCategoryTypes.diy]: 'diy',
    [RecommendationCategoryTypes.atHomeDevice]: 'at-home device',
};

export const recommendationCategoryOrder = EnumHelper
    .toOrderByKeys(RecommendationCategoryTypes)
    .map(obj => obj.value);