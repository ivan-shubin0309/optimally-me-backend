import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserHautAiField } from './models/user-haut-ai-field.entity';
import { File } from '../../files/src/models/file.entity';
import { SkinUserResult } from './models/skin-user-result.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { UserSkinDiary } from './models/user-skin-diary.entity';
import { UserQuiz } from '../../typeform/src/models/user-quiz.entity';
import { RecommendationReaction } from '../../biomarkers/src/models/recommendationReactions/recommendation-reaction.entity';
import { FilterRecommendation } from '../../biomarkers/src/models/recommendations/filter-recommendation.entity';
import { Filter } from '../../biomarkers/src/models/filters/filter.entity';
import { FilterBulletList } from '../../biomarkers/src/models/filterBulletLists/filter-bullet-list.entity';

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
        provide: 'USER_HAUT_AI_FIELD_MODEL',
        useValue: UserHautAiField
    },
    {
        provide: 'FILE_MODEL',
        useValue: File,
    },
    {
        provide: 'SKIN_USER_RESULT_MODEL',
        useValue: SkinUserResult,
    },
    {
        provide: 'USER_RESULT_MODEL',
        useValue: UserResult,
    },
    {
        provide: 'BIOMARKER_MODEL',
        useValue: Biomarker
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
        provide: 'USER_SKIN_DIARY_MODEL',
        useValue: UserSkinDiary
    },
    {
        provide: 'USER_QUIZ_MODEL',
        useValue: UserQuiz
    },
    {
        provide: 'RECOMMENDATION_REACTION_MODEL',
        useValue: RecommendationReaction
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
        provide: 'FILTER_BULLET_LIST_MODEL',
        useValue: FilterBulletList
    },
];
