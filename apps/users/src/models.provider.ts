import { User } from './models';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    }
];
