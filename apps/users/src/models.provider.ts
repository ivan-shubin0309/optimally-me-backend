import { User } from './models/user.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    }
];
