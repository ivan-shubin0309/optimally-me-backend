import sequelize from 'sequelize';

export const userBiomarkersOrderTypes = [
    'deviation',
    'category'
];

export const userBiomarkerOrderScope = {
    'deviation': { method: ['orderByDeviation'] },
    'category': { method: ['orderBy', [[sequelize.literal('`category.name`'), 'asc'], ['name', 'asc']]] }
};
