import { User } from '../../users/src/models';
import { File } from './models/file.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'FILE_MODEL',
        useValue: File,
    }
];
