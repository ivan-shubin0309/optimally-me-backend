import { WefitterBloodPressure } from './biometric-measurements/wefitter-blood-pressure.entity';
import { WefitterBloodSugar } from './biometric-measurements/wefitter-blood-sugar.entity';
import { WefitterDiastolicBloodPressure } from './biometric-measurements/wefitter-diastolic-blood-pressure.entity';
import { WefitterHrvSleep } from './biometric-measurements/wefitter-hrv-sleep.entity';
import { WefitterSystolicBloodPressure } from './biometric-measurements/wefitter-systolic-blood-pressure.entity';
import { WefitterVo2Max } from './biometric-measurements/wefitter-vo2-max.entity';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from './wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from './wefitter-sleep-summary.entity';

export type WefitterMetricResultsType = UserWefitterDailySummary[]
    | UserWefitterHeartrateSummary[]
    | UserWefitterSleepSummary[]
    | WefitterBloodPressure[]
    | WefitterBloodSugar[]
    | WefitterSystolicBloodPressure[]
    | WefitterDiastolicBloodPressure[]
    | WefitterHrvSleep[]
    | WefitterVo2Max[];

export type WefitterMetricResultType = UserWefitterDailySummary
    | UserWefitterHeartrateSummary
    | UserWefitterSleepSummary
    | WefitterBloodPressure
    | WefitterBloodSugar
    | WefitterSystolicBloodPressure
    | WefitterDiastolicBloodPressure
    | WefitterHrvSleep
    | WefitterVo2Max;