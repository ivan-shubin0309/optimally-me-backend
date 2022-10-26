import { User } from './models/user.entity';
import { UserWefitter } from "../../wefitter/src/models/user-wefitter.entity";
import { UserWefitterDailySummary } from '../../wefitter/src/models/wefitter-daily-summary.entity';

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
