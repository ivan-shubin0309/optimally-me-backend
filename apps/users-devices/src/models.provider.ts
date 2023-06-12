import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserDevice } from './models/user-device.entity';
import { UserVerifiedDevice } from '../../additional-authentications/src/models/user-verified-device.entity';
import { LastDataSource } from 'apps/wefitter/src/models/last-data-source.entity';

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
        useValue: UserVerifiedDevice
    },
    {
        provide: 'LAST_DATA_SOURCE_MODEL',
        useValue: LastDataSource
    }
];