import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Sample } from '../../samples/src/models/sample.entity';
import { UserSample } from '../../samples/src/models/user-sample.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { DnaAgeResult } from './models/dna-age-result.entity';
import { File } from '../../files/src/models/file.entity';

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
        useValue: Sample
    },
    {
        provide: 'USER_SAMPLE_MODEL',
        useValue: UserSample
    },
    {
        provide: 'BIOMARKER_MODEL',
        useValue: Biomarker
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult
    },
    {
        provide: 'DNA_AGE_RESULT_MODEL',
        useValue: DnaAgeResult
    },
    {
        provide: 'FILE_MODEL',
        useValue: File
    },
];