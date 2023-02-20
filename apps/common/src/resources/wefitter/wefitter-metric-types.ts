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
}

export const metricTypeToFieldName = {
    [WefitterMetricTypes.steps]: 'steps',
    [WefitterMetricTypes.caloriesBurned]: 'bmrCalories',
    [WefitterMetricTypes.timeAsleep]: 'totalTimeInSleep',
    [WefitterMetricTypes.sleepScore]: 'sleepScore',
    [WefitterMetricTypes.avgHeartRate]: 'average',
    /*[WefitterMetricTypes.hrvSleep]: '',
    [WefitterMetricTypes.vo2max]: '',
    [WefitterMetricTypes.bloodSugar]: '',
    [WefitterMetricTypes.bloodPressure]: '',*/
};

export const wefitterMetricNames = EnumHelper
    .toCollection(WefitterMetricTypes)
    .map(metric => metric.key);