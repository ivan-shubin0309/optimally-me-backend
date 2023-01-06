import { GetUserBiomarkersListDto } from '../../../../users-biomarkers/src/models/get-user-biomarkers-list.dto';
import sequelize from 'sequelize';

export const userBiomarkersOrderTypes = [
    'deviation',
    'category',
    'name',
    'date',
];

export const userBiomarkerOrderScope = {
    'deviation': (query: GetUserBiomarkersListDto) => ({ method: ['orderByDeviation', query.orderType] }),
    'category': (query: GetUserBiomarkersListDto) => ({ method: ['orderBy', [[sequelize.literal('`category.name`'), query.orderType], ['name', query.orderType]]] }),
    'name': (query: GetUserBiomarkersListDto) => ({ method: ['orderBy', [['name', query.orderType]]] }),
    'date': (query: GetUserBiomarkersListDto) => ({ method: ['orderBy', [[sequelize.literal('`lastResult`.`date`'), query.orderType], ['name', query.orderType]]] }),
};