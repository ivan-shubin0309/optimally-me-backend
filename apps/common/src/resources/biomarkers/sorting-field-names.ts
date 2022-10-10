import sequelize from 'sequelize';

export const sortingFieldNames = [
    'createdAt',
    'name',
    'categoryName'
];

export const sortingServerValues = {
    'createdAt': 'createdAt',
    'name': 'name',
    'categoryName': sequelize.literal('`category.name`')
};
