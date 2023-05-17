import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Hl7Template } from './models/hl7-template.entity';

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
        provide: 'HL7_TEMPLATE_MODEL',
        useValue: Hl7Template
    },
];
