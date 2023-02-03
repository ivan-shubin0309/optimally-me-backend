import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { BaseService } from '../../common/src/base/base.service';
import { UserQuiz } from './models/user-quiz.entity';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';

interface ICreateUserQuiz {
    userId: number;
    quizType: number;
    typeformFormId: string;
}

@Injectable()
export class UserQuizesService extends BaseService<UserQuiz> {
    constructor(
        @Inject('USER_QUIZ_MODEL') protected readonly model: Repository<UserQuiz>,
        private readonly configService: ConfigService
    ) { super(model); }

    create(body: ICreateUserQuiz, transaction?: Transaction): Promise<UserQuiz> {
        return this.model.create(body as any, { transaction });
    }
}
