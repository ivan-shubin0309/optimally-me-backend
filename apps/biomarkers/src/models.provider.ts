import { User } from '../../users/src/models';
import { Biomarker } from './models/biomarker.entity';
import { Category } from './models/categories/category.entity';
import { FilterEthnicity } from './models/filterEthnicity/filter-ethnicity.entity';
import { FilterOtherFeature } from './models/filterOtherFeatures/filter-other-feature.entity';
import { Filter } from './models/filters/filter.entity';
import { FilterAge } from './models/filtersAge/filter-age.entity';
import { FilterSex } from './models/filtersSex/filter-sex.entity';
import { Interaction } from './models/interactions/interaction.entity';
import { FilterRecommendation } from './models/recommendations/filter-recommendation.entity';
import { Recommendation } from './models/recommendations/recommendation.entity';
import { Unit } from './models/units/unit.entity';

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
    }
];

