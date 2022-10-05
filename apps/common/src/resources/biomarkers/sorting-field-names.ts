import { Biomarker } from '../../../../biomarkers/src/models/biomarker.entity';
import { Repository } from 'sequelize-typescript';

export const sortingFieldNames = [
    'createdAt',
    'name',
    'categoryName'
];

export const sortingServerValues = {
    'createdAt': (biomarkerModel: Repository<Biomarker>) => ['createdAt'],
    'name': (biomarkerModel: Repository<Biomarker>) => ['name'],
    'categoryName': (biomarkerModel: Repository<Biomarker>) => [biomarkerModel.associations.category, 'name']
};
