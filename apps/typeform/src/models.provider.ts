import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserQuiz } from './models/user-quiz.entity';
import { UserQuizAnswer } from './models/user-quiz-answer.entity';
import { Biomarker } from '../../biomarkers/src/models/biomarker.entity';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { UserRecommendation } from '../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { Recommendation } from '../../biomarkers/src/models/recommendations/recommendation.entity';
import { RecommendationReaction } from '../../biomarkers/src/models/recommendationReactions/recommendation-reaction.entity';
import { Hl7Object } from '../../hl7/src/models/hl7-object.entity';
import { UserKlaviyo } from '../../klaviyo/src/models/user-klaviyo.entity';

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
        provide: 'USER_QUIZ_MODEL',
        useValue: UserQuiz
    },
    {
        provide: 'USER_QUIZ_ANSWER_MODEL',
        useValue: UserQuizAnswer
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
        provide: 'HL7_OBJECT_MODEL',
        useValue: Hl7Object
    },
    {
        provide: 'USER_KLAVIYO_MODEL',
        useValue: UserKlaviyo
    }
];
