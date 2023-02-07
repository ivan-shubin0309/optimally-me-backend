import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Sample } from './models/sample.entity';

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
        provide: 'SAMPLE_MODEL',
        useValue: Sample,
    }
];
