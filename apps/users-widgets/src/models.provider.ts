import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserWidgetSetting } from './models/user-widget-setting.entity';
import { UserWidgetDataSource } from './models/user-widget-data-source.entity';
import { UserWefitter } from '../../wefitter/src/models/user-wefitter.entity';
import { UserWefitterDailySummary } from '../../wefitter/src/models/wefitter-daily-summary.entity';
import { UserWefitterHeartrateSummary } from '../../wefitter/src/models/wefitter-heartrate-summary.entity';
import { UserWefitterSleepSummary } from '../../wefitter/src/models/wefitter-sleep-summary.entity';
import { WefitterBloodPressure } from '../../wefitter/src/models/biometric-measurements/wefitter-blood-pressure.entity';
import { WefitterBloodSugar } from '../../wefitter/src/models/biometric-measurements/wefitter-blood-sugar.entity';
import { WefitterDiastolicBloodPressure } from '../../wefitter/src/models/biometric-measurements/wefitter-diastolic-blood-pressure.entity';
import { WefitterSystolicBloodPressure } from '../../wefitter/src/models/biometric-measurements/wefitter-systolic-blood-pressure.entity';
import { WefitterVo2Max } from '../../wefitter/src/models/biometric-measurements/wefitter-vo2-max.entity';
import { WefitterHrvSleep } from '../../wefitter/src/models/biometric-measurements/wefitter-hrv-sleep.entity';
import { UserDashboardSetting } from './models/user-dashboard-setting.entity';
import { UserMetricGraphSetting } from './models/user-metric-graph-setting.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'USER_ADDITIONAL_FIELD_MODEL',
        useValue: UserAdditionalField,
    },
    {
        provide: 'USER_WIDGET_SETTING_MODEL',
        useValue: UserWidgetSetting
    },
    {
        provide: 'USER_WIDGET_DATA_SOURCE_MODEL',
        useValue: UserWidgetDataSource
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
    },
    {
        provide: 'USER_DASHBOARD_SETTING_MODEL',
        useValue: UserDashboardSetting
    },
    {
        provide: 'USER_METRIC_GRAPH_SETTING_MODEL',
        useValue: UserMetricGraphSetting
    },
];