export enum DashboardWidgetTypes {
    mirrorMirror = 1,
    dnaAge = 2,
    bloodAge = 3,
    deviceData = 4,
}

export enum DeviceDataWidgetTypes {
    steps = 5,
    caloriesBurned = 6,
    vo2max = 7,
    hrvSleep = 8,
    timeAsleep = 9,
    sleepScore = 10,
    avgHeartRate = 11,
    bloodSugar = 12,
    bloodPressure = 13,
    systolicBloodPressure = 14,
    diastolicBloodPressure = 15,
}

export enum WidgetSettingTypes {
    dashboard = 1,
    deviceData = 2,
}

export const widgetSettingTypeToWidgetType = {
    [WidgetSettingTypes.dashboard]: DashboardWidgetTypes,
    [WidgetSettingTypes.deviceData]: DeviceDataWidgetTypes,
};