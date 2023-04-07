export const SAMPLE_PREFIX = 'OPME';
export const SAMPLE_CODE_FROM_STATUS_FILE = new RegExp(`^(\\d{14})_(${SAMPLE_PREFIX}[A-Z0-9]{6})_s\\.HL7$`);
export const SAMPLE_CODE_FROM_RESULT_FILE = new RegExp(`^(\\d{14})_(${SAMPLE_PREFIX}[A-Z0-9]{6})\\.HL7$`);

export const OBX_MIN_FIELDS_NUMBER = 11;
export const OBX_FIELDS_NUMBER_ERROR = 'OBX does not contain correct number of fields';

export const UNIT_MISMATCH_ERROR = 'Unit type does not match biomarker unit';

export const BIOMARKER_MAPPING_ERROR = 'Unable to map to biomarker';

export const OBJECT_ALREADY_PROCESSED_ERROR = 'Test object already processed';

export const INVALID_SAMPLE_ID_ERROR = 'Invalid Sample ID';