import { User } from '../../users/src/models';
import { Biomarker, Categories } from './models';

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
        provide: 'CATEGORIES_MODEL',
        useValue: Categories,
    }
];