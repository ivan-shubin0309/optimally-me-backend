import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { User } from '../../users/src/models';

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
        provide: 'BIOMARKER_MODEL',
        useValue: Biomarker,
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult,
    },
];