import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserVerifiedDevice } from './models/user-verified-device.entity';
import { UserDevice } from '../../users-devices/src/models/user-device.entity';
import { VerificationToken } from '../../verifications/src/models/verification-token.entity';

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
        provide: 'USER_VERIFIED_DEVICE_MODEL',
        useValue: UserVerifiedDevice,
    },
    {
        provide: 'USER_DEVICE_MODEL',
        useValue: UserDevice,
    },
    {
        provide: 'VERIFICATION_TOKEN_MODEL',
        useValue: VerificationToken
    }
];