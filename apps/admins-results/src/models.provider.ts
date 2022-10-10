import { User } from '../../users/src/models';
import { UserResult } from './models/user-result.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult,
    }
];