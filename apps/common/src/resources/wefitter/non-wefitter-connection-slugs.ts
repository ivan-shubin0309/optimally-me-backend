import { wefitterSources } from './wefitter-sources';

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

export const connectionSlugs = [
    ...wefitterSources.map(source => source.toLowerCase()),
    ...Object.values(nonWefitterConnectionSlugs)
];