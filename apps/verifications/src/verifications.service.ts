import { BadRequestException, HttpStatus, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as JWT from 'jsonwebtoken';
import { Sequelize, Repository } from 'sequelize-typescript';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { VerificationToken } from './models/verification-token.entity';
import { TranslatorService } from 'nestjs-translator';
import { BaseService } from 'apps/common/src/base/base.service';
import { DateTime } from 'luxon';

@Injectable()
export class VerificationsService extends BaseService<VerificationToken> {
  constructor(
    private readonly configService: ConfigService,
    @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    @Inject('VERIFICATION_TOKEN_MODEL') protected readonly model: Repository<VerificationToken>,
    private readonly translatorService: TranslatorService,
  ) { super(model); }

  generateToken(data: any, tokenLifeTime: number): string {
    return JWT.sign(
      { data },
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: tokenLifeTime
          ? DateTime.fromMillis(tokenLifeTime).toSeconds()
          : DateTime.fromMillis(this.configService.get('JWT_EXPIRES_IN')).toSeconds()
      }
    );
  }

  async saveToken(userId: number, token: string, type: TokenTypes, isExpirePreviousTokens = false): Promise<void> {
    await this.dbConnection.transaction(async transaction => {
      if (isExpirePreviousTokens) {
        await this.model
          .scope([
            { method: ['byType', type] },
            { method: ['byUserId', userId] }
          ])
          .update({ isExpired: true }, { transaction } as any);
      }
      await this.model.create({ userId, token, type }, { transaction });
    });
  }

  decodeToken(token: string, customMessage = 'LINK_EXPIRED'): any {
    try {
      return JWT.verify(token, this.configService.get('JWT_SECRET'), { ignoreExpiration: false });
    } catch (e) {
      throw new UnprocessableEntityException({
        message: this.translatorService.translate(customMessage),
        errorCode: customMessage,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }
  }

  async verifyToken(tokenType: number, token: string): Promise<VerificationToken> {
    const verificationToken = await this.getOne([
      { method: ['byType', tokenType] },
      { method: ['byToken', token] }
    ]);

    if (!verificationToken) {
      throw new BadRequestException({
        message: this.translatorService.translate('LINK_INVALID'),
        errorCode: 'LINK_INVALID',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    if (verificationToken.isUsed) {
      throw new BadRequestException({
        message: this.translatorService.translate('LINK_IS_USED'),
        errorCode: 'LINK_IS_USED',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }

    if (verificationToken.isExpired) {
      throw new BadRequestException({
        message: this.translatorService.translate('LINK_IS_EXPIRED'),
        errorCode: 'LINK_IS_EXPIRED',
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
    return verificationToken;
  }
}
