import {
  Post,
  Body,
  Controller,
  Delete,
  UnprocessableEntityException,
  Headers,
  HttpStatus,
  HttpCode,
  Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/src/resources/common/public.decorator';
import { LoginUserDto } from '../../users/src/models';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UserRoles } from '../../common/src/resources/users';
import { UsersService } from '../../users/src/users.service';
import { PasswordHelper } from '../../common/src/utils/helpers/password.helper';
import { TranslatorService } from 'nestjs-translator';
import { AdminsSessionDto } from './models';

@ApiTags('admins')
@Controller('admins')
export class AdminsSessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: () => AdminsSessionDto })
  @ApiOperation({ summary: 'Start session' })
  @Post('sessions')
  async createAdmins(@Body() body: LoginUserDto): Promise<AdminsSessionDto> {
    const scopes = [
      { method: ['byRoles', [UserRoles.superAdmin]] }
    ];
    const user = await this.usersService.getUserByEmail(body.email, scopes);

    if (!user) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('WRONG_CREDENTIALS'),
        errorCode: 'WRONG_CREDENTIALS',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }
    if (!PasswordHelper.compare(`${body.password}${user.salt}`, user.password)) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('WRONG_CREDENTIALS'),
        errorCode: 'WRONG_CREDENTIALS',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }

    const sessionOptions = { role: user.role, lifeTime: body.lifeTime };
    const sessionResult =  await this.sessionsService.create( user.id, sessionOptions);

    return new AdminsSessionDto(sessionResult.accessToken, sessionResult.refreshToken, sessionResult.expiresAt, user.firstName, user.lastName);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Destroy session' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('sessions')
  async logout(@Request() request, @Headers('Authorization') accessToken): Promise<void> {
    const { user } = request;

    accessToken = accessToken.split(' ')[1];

    await this.sessionsService.destroy(user.userId, accessToken);
  }
}
