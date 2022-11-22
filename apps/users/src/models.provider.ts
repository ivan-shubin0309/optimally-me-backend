import { User } from './models/user.entity';
import { UserWefitter } from '../../wefitter/src/models/user-wefitter.entity';
import { UserWefitterDailySummary } from '../../wefitter/src/models/wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from '../../wefitter/src/models/wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from '../../wefitter/src/models/wefitter-sleep-summary.entity';
import { UserWefitterStressSummary } from '../../wefitter/src/models/wefitter-stress-summary.entity';
import { UserAdditionalField } from './models/user-additional-field.entity';

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
    },
    {
        provide: 'USER_ADDITIONAL_FIELD_MODEL',
        useValue: UserAdditionalField,
    }
];
