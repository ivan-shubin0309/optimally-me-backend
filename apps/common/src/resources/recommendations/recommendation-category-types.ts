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
    [RecommendationCategoryTypes.diet]: 'Diet',
    [RecommendationCategoryTypes.lifestyle]: 'Lifestyle',
    [RecommendationCategoryTypes.supplements]: 'Supplements',
    [RecommendationCategoryTypes.doctor]: 'Doctor',
    [RecommendationCategoryTypes.tests]: 'Tests',
    [RecommendationCategoryTypes.information]: 'Information',
    [RecommendationCategoryTypes.skinProduct]: 'Skin Product',
    [RecommendationCategoryTypes.diy]: 'DIY',
    [RecommendationCategoryTypes.atHomeDevice]: 'At-home device',
};

export const recommendationCategoryOrder = EnumHelper
    .toOrderByKeys(RecommendationCategoryTypes)
    .map(obj => obj.value);