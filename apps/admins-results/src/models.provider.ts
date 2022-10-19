import { AlternativeName } from '../../biomarkers/src/models/alternativeNames/alternative-name.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { Category } from '../../biomarkers/src/models/categories/category.entity';
import { FilterEthnicity } from '../../biomarkers/src/models/filterEthnicity/filter-ethnicity.entity';
import { FilterOtherFeature } from '../../biomarkers/src/models/filterOtherFeatures/filter-other-feature.entity';
import { Filter } from '../../biomarkers/src/models/filters/filter.entity';
import { FilterAge } from '../../biomarkers/src/models/filtersAge/filter-age.entity';
import { FilterSex } from '../../biomarkers/src/models/filtersSex/filter-sex.entity';
import { Interaction } from '../../biomarkers/src/models/interactions/interaction.entity';
import { FilterRecommendation } from '../../biomarkers/src/models/recommendations/filter-recommendation.entity';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { Unit } from '../../biomarkers/src/models/units/unit.entity';
import { User } from '../../users/src/models';
import { UserResult } from './models/user-result.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult,
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
        provide: 'RECOMMENDATION_MODEL',
        useValue: Recommendation,
    },
    {
        provide: 'FILTER_RECOMMENDATION_MODEL',
        useValue: FilterRecommendation
    },
    {
        provide: 'FILTER_MODEL',
        useValue: Filter
    },
    {
        provide: 'INTERACTION_MODEL',
        useValue: Interaction
    },
    {
        provide: 'FILTER_SEX_MODEL',
        useValue: FilterSex
    },
    {
        provide: 'FILTER_AGE_MODEL',
        useValue: FilterAge
    },
    {
        provide: 'FILTER_ETHNICITY_MODEL',
        useValue: FilterEthnicity
    },
    {
        provide: 'FILTER_OTHER_FEATURE_MODEL',
        useValue: FilterOtherFeature
    },
    {
        provide: 'ALTERNATIVE_NAME_MODEL',
        useValue: AlternativeName
    }
];