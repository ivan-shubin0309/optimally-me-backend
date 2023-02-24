import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationReaction } from '../../biomarkers/src/models/recommendationReactions/recommendation-reaction.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';

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
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult
    }
];