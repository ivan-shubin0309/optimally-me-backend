import { User } from '../../users/src/models';
import { Biomarker, Category } from './models';

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
    }
];