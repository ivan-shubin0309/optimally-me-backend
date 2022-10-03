import { User } from '../../users/src/models/user.entity';
import { UserWefitter } from './models/user-wefitter.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'USER_WEFITTER_MODEL',
        useValue: UserWefitter,
    }
];