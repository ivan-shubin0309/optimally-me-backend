export enum HautAiMetricTypes {
    acne = 1,
    eyeBags = 2,
    hydration = 3,
    lines = 4,
    pigmentation = 5,
    pores = 6,
    redness = 7,
    translucency = 8,
    uniformness = 9,
}

export const ITA_SCORE_METRIC = 'itaScore';
export const PERCEIVED_AGE_METRIC = 'perceivedAge';
export const EYES_AGE_METRIC = 'eyesAge';

export const techNamesToMetricTypes = {
    'acne': HautAiMetricTypes.acne,
    'eye_bags': HautAiMetricTypes.eyeBags,
    'hydration': HautAiMetricTypes.hydration,
    'lines': HautAiMetricTypes.lines,
    'pigmentation': HautAiMetricTypes.pigmentation,
    'pores': HautAiMetricTypes.pores,
    'redness': HautAiMetricTypes.redness,
    'translucency': HautAiMetricTypes.translucency,
    'uniformness': HautAiMetricTypes.uniformness,
    'age': PERCEIVED_AGE_METRIC,
    'eyes_age': EYES_AGE_METRIC,
    'skin_tone': ITA_SCORE_METRIC,
};