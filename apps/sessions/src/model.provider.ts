import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserDevice } from '../../users-devices/src/models/user-device.entity';
import { UserCode } from './models/user-code.entity';
import { VerificationToken } from '../../verifications/src/models/verification-token.entity';
import { UserVerifiedDevice } from '../../additional-authentications/src/models/user-verified-device.entity';

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
        provide: 'USER_DEVICE_MODEL',
        useValue: UserDevice
    },
    {
        provide: 'USER_CODE_MODEL',
        useValue: UserCode
    },
    {
        provide: 'VERIFICATION_TOKEN_MODEL',
        useValue: VerificationToken
    },
    {
        provide: 'USER_VERIFIED_DEVICE_MODEL',
        useValue: UserVerifiedDevice
    }
];
