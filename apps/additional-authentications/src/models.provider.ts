import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserVerifiedDevice } from './models/user-verified-device.entity';

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
];