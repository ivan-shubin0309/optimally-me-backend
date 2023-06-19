import { GetResultsBySkinResultDto } from '../../../../haut-ai/src/models/get-results-by-skin-result.dto';
import { col, literal } from 'sequelize';
import { RecommendationTypes } from '../recommendations/recommendation-types';

export const hautAiResultOrderTypes = [
    'name',
    'recommendationRange'
];

export const hautAiResultOrderScope: any = {
    'name': (query: GetResultsBySkinResultDto) => ({ method: ['orderBy', [[col('biomarker.name'), query.orderType]]] }),
    'recommendationRange': (query: GetResultsBySkinResultDto) => ({
        method: [
            'orderBy',
            [
                literal(`FIELD(\`recommendationRange\`, ${recommendationRangeSort.join(',')}) ${query.orderType === 'desc' ? 'asc' : 'desc'}`),
            ]
        ]
    }),
};

const recommendationRangeSort = [
    RecommendationTypes.criticalLow,
    RecommendationTypes.low,
    RecommendationTypes.subOptimal,
    RecommendationTypes.supraOptimal,
    RecommendationTypes.high,
    RecommendationTypes.criticalHigh,
];