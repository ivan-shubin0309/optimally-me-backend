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
    'Acne': HautAiMetricTypes.acne,
    'eye_bags': HautAiMetricTypes.eyeBags,
    'Eye_bags': HautAiMetricTypes.eyeBags,
    'hydration': HautAiMetricTypes.hydration,
    'Hydration': HautAiMetricTypes.hydration,
    'lines': HautAiMetricTypes.lines,
    'Lines': HautAiMetricTypes.lines,
    'pigmentation': HautAiMetricTypes.pigmentation,
    'Pigmentation': HautAiMetricTypes.pigmentation,
    'pores': HautAiMetricTypes.pores,
    'Pores': HautAiMetricTypes.pores,
    'redness': HautAiMetricTypes.redness,
    'Redness': HautAiMetricTypes.redness,
    'translucency': HautAiMetricTypes.translucency,
    'Translucency': HautAiMetricTypes.translucency,
    'uniformness': HautAiMetricTypes.uniformness,
    'Uniformness': HautAiMetricTypes.uniformness,
    'age': PERCEIVED_AGE_METRIC,
    'Age': PERCEIVED_AGE_METRIC,
    'eyes_age': EYES_AGE_METRIC,
    'Eyes_age': EYES_AGE_METRIC,
    'skin_tone': ITA_SCORE_METRIC,
    'Skin_tone': ITA_SCORE_METRIC,
};