import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Hl7Template } from './models/hl7-template.entity';
import { Hl7TemplateStatus } from './models/hl7-template-status.entity';
import { FavouriteHl7Template } from './models/favourite-hl7-template.entity';

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
    {
        provide: 'HL7_TEMPLATE_STATUS_MODEL',
        useValue: Hl7TemplateStatus
    },
    {
        provide: 'FAVOURITE_HL7_TEMPLATE_MODEL',
        useValue: FavouriteHl7Template
    },
];
