import { Body, Controller, Inject, HttpCode, HttpStatus, NotFoundException, Post, Patch, Get, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { UserRoles } from '../../common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';
import { Public } from '../../common/src/resources/common/public.decorator';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { UsersService } from '../../users/src/users.service';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { RestorePasswordDto } from './models/restore-password.dto';
import { VerificationTokenDto } from '../../common/src/models/verification-token.dto';
import { Sequelize } from 'sequelize-typescript';
import { SetPasswordDto } from './models/set-password.dto';
import { SessionsService } from '../../sessions/src/sessions.service';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { AdminsSessionDto } from '../../admins-sessions/src/models';

@ApiTags('admins/verifications')
@Controller('admins/verifications')
export class AdminsVerificationsController {
  constructor(
    private readonly verificationsService: VerificationsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly mailerService: MailerService,
    private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService,
    @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
  ) { }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Send restore password' })
  @Post('password')
  async sendRestorePassword(@Body() body: RestorePasswordDto): Promise<void> {
    const scopes = [
      { method: ['byRoles', [UserRoles.superAdmin]] }
    ];
    const user = await this.usersService.getUserByEmail(body.email, scopes);

    if (!user) {
      return;
    }

    const token = await this.verificationsService.generateToken({ userId: user.id }, body.tokenLifeTime);
    await this.verificationsService.saveToken(user.id, token, TokenTypes.password, false);

    await this.mailerService.sendRestorePasswordEmail(user, token);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Verify restore password token' })
  @Get('password')
  async verifyRestorePasswordToken(@Query() query: VerificationTokenDto): Promise<void> {

    await this.verificationsService.verifyToken(TokenTypes.password, query.token);

    const decoded = await this.verificationsService.decodeToken(query.token, 'RESTORATION_LINK_EXPIRED');

    const user = await this.usersService.getOne([
      { method: ['byId', decoded.data.userId] },
      { method: ['byRoles', [UserRoles.superAdmin]] }
    ]);

    if (!user) {
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }
  }

  @Public()
  @ApiCreatedResponse({ type: () => AdminsSessionDto })
  @ApiOperation({ summary: 'Restore password' })
  @Patch('password')
  async restorePassword(@Body() body: SetPasswordDto): Promise <AdminsSessionDto> {

    const verificationToken = await this.verificationsService.verifyToken(TokenTypes.password, body.token);

    const decoded = await this.verificationsService.decodeToken(body.token, 'RESTORATION_LINK_EXPIRED');

    const user = await this.usersService.getUser(decoded.data.userId);

    if (!user) {
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    await this.dbConnection.transaction(async transaction => {
      await user.update({ password: body.password }, { transaction });

      await verificationToken.update({ isUsed: true }, { transaction });
    });

    const sessionResult = await this.sessionsService.create(user.id, {
      role: user.role,
      lifeTime: this.configService.get('JWT_EXPIRES_IN')
    });
    return new AdminsSessionDto(sessionResult.accessToken, sessionResult.refreshToken, sessionResult.expiresAt, user.firstName, user.lastName);
  }
}
