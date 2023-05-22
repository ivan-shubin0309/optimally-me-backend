import { GetUserBiomarkersListDto } from '../../../../users-biomarkers/src/models/get-user-biomarkers-list.dto';
import sequelize from 'sequelize';
import { RecommendationTypes } from '../recommendations/recommendation-types';

export const userBiomarkersOrderTypes = [
    'deviation',
    'category',
    'name',
    'date',
    'recommendationRange',
    'skinBiomarkerRange'
];

export const userBiomarkerOrderScope = {
    'deviation': (query: GetUserBiomarkersListDto) => ({ method: ['orderByDeviation', query.orderType] }),
    'category': (query: GetUserBiomarkersListDto) => ({ method: ['orderBy', [[sequelize.literal('`category.name`'), query.orderType], ['name', query.orderType]]] }),
    'name': (query: GetUserBiomarkersListDto) => ({ method: ['orderBy', [['name', query.orderType]]] }),
    'date': (query: GetUserBiomarkersListDto) => ({
        method: [
            'orderBy',
            [
                [sequelize.literal('`lastResult`.`date`'), query.orderType],
                sequelize.literal(`FIELD(\`lastResult\`.\`recommendationRange\`, ${recommendationRangeSort.join(',')}) ${query.orderType === 'desc' ? 'asc' : 'desc'}`),
                [sequelize.literal('`lastResult`.`deviation`'), query.orderType],
            ]
        ]
    }),
    'recommendationRange': (query: GetUserBiomarkersListDto) => ({
        method: [
            'orderBy',
            [
                sequelize.literal(`FIELD(\`lastResult\`.\`recommendationRange\`, ${recommendationRangeSort.join(',')}) ${query.orderType === 'desc' ? 'asc' : 'desc'}`),
                [sequelize.literal('`lastResult`.`deviation`'), query.orderType],
            ]
        ]
    }),
    'skinBiomarkerRange': (query: GetUserBiomarkersListDto) => ({
        method: [
            'orderBy',
            [
                sequelize.literal(`FIELD(\`lastResult\`.\`recommendationRange\`, ${skinBiomarkerRangeSort.join(',')}) ${query.orderType === 'desc' ? 'asc' : 'desc'}`),
                [sequelize.literal('`lastResult`.`value`'), query.orderType === 'desc' ? 'asc' : 'desc'],
                ['name', query.orderType === 'desc' ? 'asc' : 'desc']
            ]
        ]
    }),
};

const recommendationRangeSort = [
    RecommendationTypes.criticalHigh,
    RecommendationTypes.criticalLow,
    RecommendationTypes.high,
    RecommendationTypes.low,
    RecommendationTypes.supraOptimal,
    RecommendationTypes.subOptimal,
    RecommendationTypes.optimal,
];

const skinBiomarkerRangeSort = [
    RecommendationTypes.criticalLow,
    RecommendationTypes.low,
    RecommendationTypes.subOptimal,
    RecommendationTypes.optimal,
    RecommendationTypes.supraOptimal,
    RecommendationTypes.high,
    RecommendationTypes.criticalHigh,
];