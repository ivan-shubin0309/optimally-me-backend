import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as crypto from 'crypto';
import { Transaction } from 'sequelize/types';
import { ITypeformAnswer } from '../../common/src/resources/typeform/typeform-helper';
import { User } from '../../users/src/models';
import { NOT_SENSITIVE_SKIN_ANSWER, SENSITIVE_SKIN_QUESTION } from '../../common/src/resources/typeform/typeform-quiz-types';
import { UserQuiz } from './models/user-quiz.entity';
import axios from 'axios';

@Injectable()
export class TypeformService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    private getHeaders(): Record<string, string | number | boolean> {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.configService.get('TYPEFORM_PERSONAL_TOKEN')}`
        };
    }

    verifySignature(signature: string, rawBody: Buffer): boolean {
        const hash = crypto
            .createHmac('sha256', this.configService.get('TYPEFORM_SECRET'))
            .update(rawBody)
            .digest('base64');

        return hash === signature;
    }

    async saveSensitiveQuizParameters(answers: ITypeformAnswer[], user: User, transaction?: Transaction): Promise<void> {
        const sensivitiveSkinAnswer = answers.find(answer => answer.questionText.includes(SENSITIVE_SKIN_QUESTION));
        const isSensitiveSkin = sensivitiveSkinAnswer.answerText !== NOT_SENSITIVE_SKIN_ANSWER;

        await user.additionalField.update({ isSensitiveSkin }, { transaction });
    }

    async saveSelfAssesmentQuizParameters(answers: ITypeformAnswer[], user: User, transaction?: Transaction): Promise<void> {
        await user.additionalField.update({ isSelfAssesmentQuizCompleted: true }, { transaction });
    }

    async getFormResponse(userQuiz: UserQuiz): Promise<any> {
        const url = `https://api.typeform.com/forms/${userQuiz.typeformFormId}/responses`;

        const response = await axios.get(url, { headers: this.getHeaders() })
            .catch(err => {
                console.log(err.message);
                throw new UnprocessableEntityException({
                    message: err.message,
                    errorCode: 'TYPEFORM_API_ERROR',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                });
            });

        if (response?.data?.items?.length && response?.data?.items[0]) {
            return response?.data?.items[0];
        }

        return null;
    }
}
