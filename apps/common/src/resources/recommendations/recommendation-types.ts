export enum RecommendationTypes {
    criticalLow = 1,
    low = 2,
    subOptimal = 3,
    optimal = 4,
    supraOptimal = 5,
    high = 6,
    criticalHigh = 7,
}

export const recommendationTypesClientValues = {
    [RecommendationTypes.criticalLow]: 'Critical Low',
    [RecommendationTypes.criticalHigh]: 'Critical High',
    [RecommendationTypes.high]: 'High',
    [RecommendationTypes.low]: 'Low',
    [RecommendationTypes.subOptimal]: 'Borderline',
    [RecommendationTypes.supraOptimal]: 'Borderline',
    [RecommendationTypes.optimal]: 'Optimal'
};