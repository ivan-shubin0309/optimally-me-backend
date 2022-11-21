import { User } from 'apps/users/src/models';
import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { VerificationToken } from '../../verifications/src/models/verification-token.entity';


export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'VERIFICATION_TOKEN_MODEL',
        useValue: VerificationToken
    },
    {
        provide: 'USER_ADDITIONAL_FIELD_MODEL',
        useValue: UserAdditionalField,
    }
];