import { User } from '../../users/src/models';
import {
    Biomarker,
    Category,
    Unit,
    BiomarkerRule,
    BiomarkerInteraction,
    AlternativeName,
    BiomarkerFilter,
    FilterRecommendation,
    LibraryInteraction,
    BiomarkerFilterAge,
    LibraryFilterAge,
    BiomarkerFilterSex,
    LibraryFilterSex,
    BiomarkerFilterEthnicity,
    LibraryFilterEthnicity,
    BiomarkerFilterOtherFeature,
    LibraryFilterOtherFeature,
    LibraryFilter,
    LibraryFilterRecommendation,
    LibraryRule,
    Recommendation
} from './models';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'BIOMARKER_MODEL',
        useValue: Biomarker,
    },
    {
        provide: 'CATEGORY_MODEL',
        useValue: Category,
    },
    {
        provide: 'UNIT_MODEL',
        useValue: Unit,
    },
    {
        provide: 'BIOMARKER_RULE_MODEL',
        useValue: BiomarkerRule,
    },
    {
        provide: 'BIOMARKER_INTERACTION_MODEL',
        useValue: BiomarkerInteraction,
    },
    {
        provide: 'ALTERNATIVE_NAME_MODEL',
        useValue: AlternativeName,
    },
    {
        provide: 'BIOMARKER_FILTER_MODEL',
        useValue: BiomarkerFilter,
    },
    {
        provide: 'FILTER_RECOMMENDATION_MODEL',
        useValue: FilterRecommendation,
    },
    {
        provide: 'LIBRARY_INTERACTION_MODEL',
        useValue: LibraryInteraction,
    },
    {
        provide: 'BIOMARKER_FILTER_AGE_MODEL',
        useValue: BiomarkerFilterAge,
    },
    {
        provide: 'LIBRARY_FILTER_AGE_MODEL',
        useValue: LibraryFilterAge,
    },
    {
        provide: 'BIOMARKER_FILTER_SEX_MODEL',
        useValue: BiomarkerFilterSex,
    },
    {
        provide: 'LIBRARY_FILTER_SEX_MODEL',
        useValue: LibraryFilterSex,
    },
    {
        provide: 'BIOMARKER_FILTER_ETHNICITY_MODEL',
        useValue: BiomarkerFilterEthnicity,
    },
    {
        provide: 'LIBRARY_FILTER_ETHNICITY_MODEL',
        useValue: LibraryFilterEthnicity,
    },
    {
        provide: 'BIOMARKER_FILTER_OTHER_FEATURE_MODEL',
        useValue: BiomarkerFilterOtherFeature,
    },
    {
        provide: 'LIBRARY_FILTER_OTHER_FEATURE_MODEL',
        useValue: LibraryFilterOtherFeature,
    },
    {
        provide: 'LIBRARY_FILTER_MODEL',
        useValue: LibraryFilter,
    },
    {
        provide: 'LIBRARY_FILTER_RECOMMENDATION_MODEL',
        useValue: LibraryFilterRecommendation,
    },
    {
        provide: 'LIBRARY_RULE_MODEL',
        useValue: LibraryRule,
    },
    {
        provide: 'RECOMMENDATION_MODEL',
        useValue: Recommendation,
    },
];

