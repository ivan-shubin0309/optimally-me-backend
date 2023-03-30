import { EnumHelper } from '../../utils/helpers/enum.helper';

export enum WefitterMetricTypes {
    steps = 1,
    caloriesBurned = 2,
    vo2max = 3,
    hrvSleep = 4,
    timeAsleep = 5,
    sleepScore = 6,
    avgHeartRate = 7,
    bloodSugar = 8,
    bloodPressure = 9,
    systolicBloodPressure = 10,
    diastolicBloodPressure = 11,
    awake = 12,
    light = 13,
    deep = 14,
    rem = 15,
}

export const metricTypeToFieldName = {
    [WefitterMetricTypes.steps]: 'steps',
    [WefitterMetricTypes.caloriesBurned]: 'calories',
    [WefitterMetricTypes.timeAsleep]: 'totalTimeInSleep',
    [WefitterMetricTypes.sleepScore]: 'sleepScore',
    [WefitterMetricTypes.avgHeartRate]: 'average',
    [WefitterMetricTypes.hrvSleep]: 'value',
    [WefitterMetricTypes.vo2max]: 'value',
    [WefitterMetricTypes.bloodSugar]: 'value',
    [WefitterMetricTypes.bloodPressure]: 'value',
    [WefitterMetricTypes.systolicBloodPressure]: 'value',
    [WefitterMetricTypes.diastolicBloodPressure]: 'value',
    [WefitterMetricTypes.awake]: 'awake',
    [WefitterMetricTypes.light]: 'light',
    [WefitterMetricTypes.deep]: 'deep',
    [WefitterMetricTypes.rem]: 'rem',
};

export const wefitterMetricNames = EnumHelper
    .toCollection(WefitterMetricTypes)
    .map(metric => metric.key);