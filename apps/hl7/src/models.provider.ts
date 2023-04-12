import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { Hl7Object } from './models/hl7-object.entity';
import { UserSample } from '../../samples/src/models/user-sample.entity';
import { File } from '../../files/src/models/file.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { Filter } from '../../biomarkers/src/models/filters/filter.entity';
import { FilterRecommendation } from '../../biomarkers/src/models/recommendations/filter-recommendation.entity';
import { FilterBulletList } from '../../biomarkers/src/models/filterBulletLists/filter-bullet-list.entity';
import { Hl7CriticalRange } from './models/hl7-critical-range.entity';
import { Hl7FileError } from './models/hl7-file-error.entity';
import { Hl7ErrorNotification } from '../../hl7-error-notifications/src/models/hl7-error-notification.entity';

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
        provide: 'HL7_OBJECT_MODEL',
        useValue: Hl7Object
    },
    {
        provide: 'USER_SAMPLE_MODEL',
        useValue: UserSample
    },
    {
        provide: 'FILE_MODEL',
        useValue: File,
    },
    {
        provide: 'BIOMARKER_MODEL',
        useValue: Biomarker,
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult,
    },
    {
        provide: 'RECOMMENDATION_MODEL',
        useValue: Recommendation
    },
    {
        provide: 'USER_RECOMMENDATION_MODEL',
        useValue: UserRecommendation
    },
    {
        provide: 'FILTER_MODEL',
        useValue: Filter
    },
    {
        provide: 'FILTER_RECOMMENDATION_MODEL',
        useValue: FilterRecommendation
    },
    {
        provide: 'FILTER_BULLET_LIST_MODEL',
        useValue: FilterBulletList
    },
    {
        provide: 'HL7_CRITICAL_RANGE_MODEL',
        useValue: Hl7CriticalRange
    },
    {
        provide: 'HL7_FILE_ERROR_MODEL',
        useValue: Hl7FileError
    },
    {
        provide: 'HL7_ERROR_NOTIFICATION_MODEL',
        useValue: Hl7ErrorNotification
    }
];
