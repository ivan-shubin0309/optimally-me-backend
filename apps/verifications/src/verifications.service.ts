import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as JWT from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { VerificationToken } from './models/verification-token.entity';

@Injectable()
export class VerificationsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    @Inject('VERIFICATION_TOKEN_MODEL') private readonly VerificationTokenModel: typeof VerificationToken,
  ) { }

  generateToken(data: any, tokenLifeTime: number): string {
    return JWT.sign(
      { data },
      this.configService.get('JWT_SECRET'),
      { expiresIn: tokenLifeTime || this.configService.get('JWT_EXPIRES_IN') }
    );
  }

  async saveToken(userId: number, token: string, type: TokenTypes, isDeletePreviousTokens = false): Promise<void> {
    await this.dbConnection.transaction(async transaction => {
      if (isDeletePreviousTokens) {
        await this.VerificationTokenModel.destroy({ where: { type, userId }, transaction });
      }
      await this.VerificationTokenModel.create({ userId, token, type }, { transaction });
    });
  }
}
