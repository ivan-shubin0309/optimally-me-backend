import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { DnaAgeResult } from '../../dna-age/src/models/dna-age-result.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';

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
        provide: 'DNA_AGE_RESULT_MODEL',
        useValue: DnaAgeResult
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult
    },
];