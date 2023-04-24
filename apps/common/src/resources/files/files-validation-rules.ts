import { FileTypes, InternalFileTypes } from './file-types';

export const FILE_TYPES = ['image/jpeg', 'image/pjpeg', 'image/png'];
export const HL7_FILE_TYPE = 'x-application/hl7-v2+er7';
export const PDF_CONTENT_TYPE = 'application/pdf';

export const rules = {
    filesContentTypes: {
        jpg: {
            contentTypes: [
                'image/jpeg',
                'image/pjpeg'
            ],
            extension: 'jpg',
        },
        png: {
            contentTypes: [
                'image/png'
            ],
            extension: 'png'
        },
        hl7: {
            contentTypes: [
                HL7_FILE_TYPE
            ],
            extension: 'hl7'
        },
        pdf: {
            contentTypes: [
                PDF_CONTENT_TYPE
            ],
            extension: 'pdf'
        }
    },
    supportedTypes: {
        [FileTypes.recommendation]: FILE_TYPES,
        [FileTypes.mirrorMirror]: FILE_TYPES,
        [InternalFileTypes.hl7]: [HL7_FILE_TYPE, PDF_CONTENT_TYPE],
    },
    maxUploadFiles: 16
};
