export const userRecommendationsSortingFieldNames = [
    'priority',
];

export const userRecommendationsSortingServerValues = {
    'priority': (orderType, resultIds) => ({ method: ['orderByPriority', orderType, resultIds] }),
};
