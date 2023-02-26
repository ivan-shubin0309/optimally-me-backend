import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { User } from '../../users/src/models';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { Filter } from '../../biomarkers/src/models/filters/filter.entity';
import { FilterRecommendation } from '../../biomarkers/src/models/recommendations/filter-recommendation.entity';
import { FilterBulletList } from '../../biomarkers/src/models/filterBulletLists/filter-bullet-list.entity';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationReaction } from '../../biomarkers/src/models/recommendationReactions/recommendation-reaction.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { Interaction } from '../../biomarkers/src/models/interactions/interaction.entity';
import { FilterSex } from '../../biomarkers/src/models/filtersSex/filter-sex.entity';
import { FilterAge } from '../../biomarkers/src/models/filtersAge/filter-age.entity';
import { FilterEthnicity } from '../../biomarkers/src/models/filterEthnicity/filter-ethnicity.entity';
import { FilterOtherFeature } from '../../biomarkers/src/models/filterOtherFeatures/filter-other-feature.entity';
import { AlternativeName } from '../../biomarkers/src/models/alternativeNames/alternative-name.entity';
import { FilterGroup } from '../../biomarkers/src/models/filterGroups/filter-group.entity';
import { FilterSummary } from '../../biomarkers/src/models/filterSummaries/filter-summary.entity';
import { StudyLink } from '../../biomarkers/src/models/filterBulletLists/study-link.entity';

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
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult,
    },
    {
        provide: 'FILTER_MODEL',
        useValue: Filter,
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
        provide: 'USER_RECOMMENDATION_MODEL',
        useValue: UserRecommendation
    },
    {
        provide: 'RECOMMENDATION_MODEL',
        useValue: Recommendation
    },
    {
        provide: 'RECOMMENDATION_REACTION_MODEL',
        useValue: RecommendationReaction
    },
    {
        provide: 'BIOMARKER_MODEL',
        useValue: Biomarker
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
        provide: 'FILTER_GROUP_MODEL',
        useValue: FilterGroup
    },
    {
        provide: 'FILTER_SUMMARY_MODEL',
        useValue: FilterSummary
    },
    {
        provide: 'STUDY_LINK_MODEL',
        useValue: StudyLink
    },
];