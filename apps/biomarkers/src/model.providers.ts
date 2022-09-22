import { User } from '../../users/src/models';
import { Biomarker, Category, Unit } from './models';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'BIOMARKER_MODEL',
        useValue: Biomarker,
    },
    {
        provide: 'CATEGORY_MODEL',
        useValue: Category,
    },
    {
        provide: 'UNIT_MODEL',
        useValue: Unit,
    }
];