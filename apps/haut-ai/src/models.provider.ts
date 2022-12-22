import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserHautAiField } from './models/user-haut-ai-field.entity';
import { File } from '../../files/src/models/file.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'USER_ADDITIONAL_FIELD_MODEL',
        useValue: UserAdditionalField,
    },
    {
        provide: 'USER_HAUT_AI_FIELD_MODEL',
        useValue: UserHautAiField
    },
    {
        provide: 'FILE_MODEL',
        useValue: File,
    },
];
