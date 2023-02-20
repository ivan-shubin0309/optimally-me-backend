import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models/user.entity';
import { UserWefitter } from './models/user-wefitter.entity';
import { UserWefitterDailySummary } from './models/wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './models/wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from './models/wefitter-sleep-summary.entity';

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
        provide: 'USER_ADDITIONAL_FIELD_MODEL',
        useValue: UserAdditionalField,
    }
];