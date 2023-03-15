export const userRecommendationsSortingFieldNames = [
    'priority',
];

export const userRecommendationsSortingServerValues = {
    'priority': (orderType) => ({ method: ['orderByPriority', orderType] }),
};
