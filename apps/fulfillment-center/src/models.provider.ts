import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Sample } from '../../samples/src/models/sample.entity';
import { UserSample } from '../../samples/src/models/user-sample.entity';

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
        useValue: Sample
    },
    {
        provide: 'USER_SAMPLE_MODEL',
        useValue: UserSample
    },
];
