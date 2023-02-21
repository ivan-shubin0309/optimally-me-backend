import { User } from './models/user.entity';
import { UserWefitter } from '../../wefitter/src/models/user-wefitter.entity';
import { UserWefitterDailySummary } from '../../wefitter/src/models/wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from '../../wefitter/src/models/wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from '../../wefitter/src/models/wefitter-sleep-summary.entity';
import { UserAdditionalField } from './models/user-additional-field.entity';
import { VerificationToken } from '../../verifications/src/models/verification-token.entity';
import { WefitterBloodPressure } from 'apps/wefitter/src/models/biometric-measurements/wefitter-blood-pressure.entity';
import { WefitterBloodSugar } from 'apps/wefitter/src/models/biometric-measurements/wefitter-blood-sugar.entity';
import { WefitterDiastolicBloodPressure } from 'apps/wefitter/src/models/biometric-measurements/wefitter-diastolic-blood-pressure.entity';
import { WefitterSystolicBloodPressure } from 'apps/wefitter/src/models/biometric-measurements/wefitter-systolic-blood-pressure.entity';
import { WefitterVo2Max } from 'apps/wefitter/src/models/biometric-measurements/wefitter-vo2-max.entity';
import { WefitterHrvSleep } from 'apps/wefitter/src/models/biometric-measurements/wefitter-hrv-sleep.entity';

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
        provide: 'VERIFICATION_TOKEN_MODEL',
        useValue: VerificationToken
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
