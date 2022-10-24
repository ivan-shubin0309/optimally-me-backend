import sequelize from 'sequelize';
import { recommendationCategoryOrder } from './recommendation-category-types';

export const sortingFieldNames = [
    'createdAt',
    'category',
    'title'
];

export const sortingServerValues = {
    'createdAt': 'createdAt',
    'category': sequelize.literal(`FIELD(category, ${recommendationCategoryOrder.join(',')})`),
    'title': 'title'
};
