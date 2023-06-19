import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserQuizAnswer } from './models/user-quiz-answer.entity';
import { Transaction } from 'sequelize';

interface ICreateUserQuizAnswer {
    userId: number;
    quizId: number;
    questionId: string;
    questionText: string;
    answerType: string;
    answerText: string;
}

@Injectable()
export class UserQuizAnswersService extends BaseService<UserQuizAnswer> {
    constructor(
        @Inject('USER_QUIZ_ANSWER_MODEL') protected readonly model: Repository<UserQuizAnswer>,
        private readonly configService: ConfigService
    ) { super(model); }

    bulkCreate(body: ICreateUserQuizAnswer[], transaction?: Transaction): Promise<UserQuizAnswer[]> {
        return this.model.bulkCreate(body as any, { transaction });
    }
}
