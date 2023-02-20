import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models/user.entity';
import { WefitterBloodPressure } from './models/biometric-measurements/wefitter-blood-pressure.entity';
import { WefitterBloodSugar } from './models/biometric-measurements/wefitter-blood-sugar.entity';
import { WefitterDiastolicBloodPressure } from './models/biometric-measurements/wefitter-diastolic-blood-pressure.entity';
import { WefitterHrvSleep } from './models/biometric-measurements/wefitter-hrv-sleep.entity';
import { WefitterSystolicBloodPressure } from './models/biometric-measurements/wefitter-systolic-blood-pressure.entity';
import { WefitterVo2Max } from './models/biometric-measurements/wefitter-vo2-max.entity';
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
    },
    {
        provide: 'WEFITTER_BLOOD_PRESSURE',
        useValue: WefitterBloodPressure
    },
    {
        provide: 'WEFITTER_BLOOD_SUGAR',
        useValue: WefitterBloodSugar
    },
    {
        provide: 'WEFITTER_DIASTOLIC_BLOOD_PRESSURE',
        useValue: WefitterDiastolicBloodPressure
    },
    {
        provide: 'WEFITTER_SYSTOLIC_BLOOD_PRESSURE',
        useValue: WefitterSystolicBloodPressure
    },
    {
        provide: 'WEFITTER_VO2_MAX',
        useValue: WefitterVo2Max
    },
    {
        provide: 'WEFITTER_HRV_SLEEP',
        useValue: WefitterHrvSleep
    }
];