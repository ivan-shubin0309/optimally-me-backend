import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Sample } from './models/sample.entity';
import { UserSample } from './models/user-sample.entity';
import { Hl7Object } from '../../hl7/src/models/hl7-object.entity';
import { UserKlaviyo } from '../../klaviyo/src/models/user-klaviyo.entity';

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
        provide: 'SAMPLE_MODEL',
        useValue: Sample,
    },
    {
        provide: 'USER_SAMPLE_MODEL',
        useValue: UserSample
    },
    {
        provide: 'HL7_OBJECT_MODEL',
        useValue: Hl7Object
    },
    {
        provide: 'USER_KLAVIYO_MODEL',
        useValue: UserKlaviyo
    }
];
