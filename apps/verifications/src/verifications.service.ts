import { BadRequestException, HttpStatus, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import * as JWT from 'jsonwebtoken';
import { Sequelize, Repository } from 'sequelize-typescript';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { VerificationToken } from './models/verification-token.entity';
import { TranslatorService } from 'nestjs-translator';
import { Transaction } from 'sequelize/types';

@Injectable()
export class VerificationsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
    @Inject('VERIFICATION_TOKEN_MODEL') private readonly VerificationTokenModel: Repository<VerificationToken>,
    private readonly translatorService: TranslatorService,
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

  decodeToken(token: string, customMessage = 'LINK_EXPIRED'): any {
    try {
      return JWT.verify(token, this.configService.get('JWT_SECRET'));
    } catch (e) {
      throw new UnprocessableEntityException({
        message: this.translatorService.translate(customMessage),
        errorCode: customMessage,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }
  }

  getOne(scopes = [], transaction?: Transaction): Promise<VerificationToken> {
    return this.VerificationTokenModel
      .scope(scopes)
      .findOne({ transaction });
  }

  async verifyToken(TokenTypes: number, token: string): Promise<VerificationToken> {
    const verificationToken = await this.getOne([
      { method: ['byType', TokenTypes] },
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
    return verificationToken;
  }
}
