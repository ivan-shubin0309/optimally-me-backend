import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Hl7ErrorNotification } from './models/hl7-error-notification.entity';

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
        provide: 'HL7_ERROR_NOTIFICATION_MODEL',
        useValue: Hl7ErrorNotification
    }
];
