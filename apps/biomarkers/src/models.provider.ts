import { File } from 'apps/files/src/models/file.entity';
import { User } from '../../users/src/models';
import { AlternativeName } from './models/alternativeNames/alternative-name.entity';
import { Biomarker } from './models/biomarker.entity';
import { Category } from './models/categories/category.entity';
import { FilterEthnicity } from './models/filterEthnicity/filter-ethnicity.entity';
import { FilterGroup } from './models/filterGroups/filter-group.entity';
import { FilterOtherFeature } from './models/filterOtherFeatures/filter-other-feature.entity';
import { Filter } from './models/filters/filter.entity';
import { FilterAge } from './models/filtersAge/filter-age.entity';
import { FilterSex } from './models/filtersSex/filter-sex.entity';
import { FilterSummary } from './models/filterSummaries/filter-summary.entity';
import { Interaction } from './models/interactions/interaction.entity';
import { RecommendationImpact } from './models/recommendationImpacts/recommendation-impact.entity';
import { FilterRecommendation } from './models/recommendations/filter-recommendation.entity';
import { RecommendationFile } from './models/recommendations/recommendation-file.entity';
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
    },
    {
        provide: 'ALTERNATIVE_NAME_MODEL',
        useValue: AlternativeName
    },
    {
        provide: 'FILE_MODEL',
        useValue: File
    },
    {
        provide: 'RECOMMENDATION_FILE_MODEL',
        useValue: RecommendationFile
    },
    {
        provide: 'RECOMMENDATION_IMPACT_MODEL',
        useValue: RecommendationImpact
    },
    {
        provide: 'FILTER_GROUP_MODEL',
        useValue: FilterGroup
    },
    {
        provide: 'FILTER_SUMMARY_MODEL',
        useValue: FilterSummary
    }
];

