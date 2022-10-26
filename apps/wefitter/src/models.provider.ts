import { User } from '../../users/src/models/user.entity';
import { UserWefitter } from './models/user-wefitter.entity';
import { UserWefitterDailySummary } from './models/wefitter-daily-summary.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'USER_WEFITTER_MODEL',
        useValue: UserWefitter,
    },
    {
        provide: 'USER_WEFITTER_DAILY_SUMMARY_MODEL',
        useValue: UserWefitterDailySummary,
    }
];