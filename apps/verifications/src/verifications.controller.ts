import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { UserRoles } from '../../common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';
import { Public } from '../../common/src/resources/common/public.decorator';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { UsersService } from '../../users/src/users.service';
import { VerificationsService } from './verifications.service';
import { RestorePasswordDto } from './models/restore-password.dto';

@ApiTags('verifications')
@Controller('verifications')
export class VerificationsController {
  constructor(
    private readonly verificationsService: VerificationsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly mailerService: MailerService,
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
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const token = await this.verificationsService.generateToken({ userId: user.id }, body.tokenLifeTime);
    await this.verificationsService.saveToken(user.id, token, TokenTypes.password, false);

    await this.mailerService.sendRestorePasswordEmail(user, token);
  }
}
