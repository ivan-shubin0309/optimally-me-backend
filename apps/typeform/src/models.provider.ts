import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserQuiz } from './models/user-quiz.entity';
import { UserQuizAnswer } from './models/user-quiz-answer.entity';

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
];
