export const SAMPLE_PREFIX = 'OPME';
export const SAMPLE_CODE_FROM_STATUS_FILE = new RegExp(`^\\d{14}_(${SAMPLE_PREFIX}[A-Z0-9]{6})_s\\.HL7$`);
export const SAMPLE_CODE_FROM_RESULT_FILE = new RegExp(`^\\d{14}_(${SAMPLE_PREFIX}[A-Z0-9]{6})\\.HL7$`);