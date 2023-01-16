import { File } from 'apps/files/src/models/file.entity';
import { User } from '../../users/src/models';
import { AlternativeName } from './models/alternativeNames/alternative-name.entity';
import { Biomarker } from './models/biomarker.entity';
import { Category } from './models/categories/category.entity';
import { FilterEthnicity } from './models/filterEthnicity/filter-ethnicity.entity';
import { FilterBulletList } from './models/filterBulletLists/filter-bullet-list.entity';
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
import { StudyLink } from './models/filterBulletLists/study-link.entity';
import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { ImpactStudyLink } from './models/recommendationImpacts/impact-study-link.entity';
import { UserRecommendation } from './models/userRecommendations/user-recommendation.entity';
import { FilterSkinType } from './models/filterSkinTypes/filter-skin-type.entity';
import { FilterContradiction } from './models/filterContradictions/filter-contradiction.entity';
import { RecommendationSkinType } from './models/recommendationSkinTypes/recommendation-skin-type.entity';
import { RecommendationContradiction } from './models/recommendationContradictions/recommendation-contradiction.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';

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
    },
    {
        provide: 'FILTER_BULLET_LIST_MODEL',
        useValue: FilterBulletList
    },
    {
        provide: 'STUDY_LINK_MODEL',
        useValue: StudyLink
    },
    {
        provide: 'USER_ADDITIONAL_FIELD_MODEL',
        useValue: UserAdditionalField,
    },
    {
        provide: 'IMPACT_STUDY_LINK_MODEL',
        useValue: ImpactStudyLink,
    },
    {
        provide: 'USER_RECOMMENDATION_MODEL',
        useValue: UserRecommendation,
    },
    {
        provide: 'FILTER_SKIN_TYPE_MODEL',
        useValue: FilterSkinType,
    },
    {
        provide: 'FILTER_CONTRADICTION_MODEL',
        useValue: FilterContradiction
    },
    {
        provide: 'RECOMMENDATION_SKIN_TYPE_MODEL',
        useValue: RecommendationSkinType
    },
    {
        provide: 'RECOMMENDATION_CONTRADICTION_MODEL',
        useValue: RecommendationContradiction
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult
    }
];

