import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as crypto from 'crypto';
import { Transaction } from 'sequelize/types';
import { ITypeformAnswer } from '../../common/src/resources/typeform/typeform-helper';
import { User } from '../../users/src/models';
import { NOT_SENSITIVE_SKIN_ANSWER, SENSITIVE_SKIN_QUESTION } from '../../common/src/resources/typeform/typeform-quiz-types';

@Injectable()
export class TypeformService {
  constructor(
    private readonly configService: ConfigService
  ) { }

  verifySignature(signature: string, rawBody: Buffer): boolean {
    const hash = crypto
      .createHmac('sha256', this.configService.get('TYPEFORM_SECRET'))
      .update(rawBody)
      .digest('base64');

    return hash === signature;
  }

  async saveParametersFromQuiz(answers: ITypeformAnswer[], user: User, transaction?: Transaction) {
    const sensivitiveSkinAnswer = answers.find(answer => answer.questionText.includes(SENSITIVE_SKIN_QUESTION));
    const isSensitiveSkin = sensivitiveSkinAnswer.answerText !== NOT_SENSITIVE_SKIN_ANSWER;

    await user.additionalField.update({ isSensitiveSkin }, { transaction });
  }
}
