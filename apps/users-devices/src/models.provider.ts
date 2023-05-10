import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserDevice } from './models/user-device.entity';
import { UsersVerifiedDevicesService } from '../../additional-authentications/src/users-verified-devices.service';

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
        provide: 'USER_VERIFIED_DEVICE_MODEL',
        useValue: UsersVerifiedDevicesService
    }
];