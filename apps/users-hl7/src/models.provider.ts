import { Hl7Object } from '../../hl7/src/models/hl7-object.entity';
import { UserCode } from '../../sessions/src/models/user-code.entity';
import { UserDevice } from '../../users-devices/src/models/user-device.entity';
import { User } from '../../users/src/models';
import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';


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
        provide: 'HL7_OBJECT_MODEL',
        useValue: Hl7Object
    },
];
