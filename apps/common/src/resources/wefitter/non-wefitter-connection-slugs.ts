export const nonWefitterConnectionSlugs = {
    android: 'android',
    samsung: 'samsung',
    apple: 'apple',
};

export const nonWefitterFieldNames = {
    [nonWefitterConnectionSlugs.android]: 'isAndroidSdkConnected',
    [nonWefitterConnectionSlugs.samsung]: 'isSamsungHealthConnected',
    [nonWefitterConnectionSlugs.apple]: 'isAppleHealthConnected',
};
