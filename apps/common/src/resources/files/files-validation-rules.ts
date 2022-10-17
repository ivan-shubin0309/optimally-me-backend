import { FileTypes } from './file-types';

export const FILE_TYPES = ['image/jpeg', 'image/pjpeg', 'image/png'];

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
        }
    },
    supportedTypes: {
        [FileTypes.recommendation]: FILE_TYPES,
    },
    maxUploadFiles: 16
};
