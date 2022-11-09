import { User } from '../../users/src/models/user.entity';
import { UserWefitter } from './models/user-wefitter.entity';
import { UserWefitterDailySummary } from './models/wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './models/wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from './models/wefitter-sleep-summary.entity';
import { UserWefitterStressSummary } from './models/wefitter-stress-summary.entity';

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
    },
    {
        provide: 'USER_WEFITTER_HEARTRATE_SUMMARY_MODEL',
        useValue: UserWefitterHeartrateSummary,
    },
    {
        provide: 'USER_WEFITTER_SLEEP_SUMMARY_MODEL',
        useValue: UserWefitterSleepSummary,
    },
    {
        provide: 'USER_WEFITTER_STRESS_SUMMARY_MODEL',
        useValue: UserWefitterStressSummary,
    }
];