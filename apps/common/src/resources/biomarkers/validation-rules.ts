export const biomarkerValidationRules = {
    alternativeNamesMax: 10,
    nameMaxLength: 200,
    nameMinLength: 1,
    filtersMaxCount: 255,
    labelMinLength: 1,
    labelMaxLength: 4,
    shortNameMinLength: 1,
    shortNameMaxLength: 12,
};

export const skinBiomarkerValidationRules = {
    filtersMaxCount: 1,
    maxRecommendations: 30
};

export const ALTERNATIVE_NAMES_LIMIT_ERROR_MESSAGE = 'Max. 10 alternative names can be added';
export const BIOMARKER_NAME_ERROR_MESSAGE = 'Name can not contain only spaces';