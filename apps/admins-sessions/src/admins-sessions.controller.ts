import {
  Post,
  Body,
  Controller,
  Delete,
  UnprocessableEntityException,
  Headers,
  HttpStatus,
  HttpCode,
  Request,
  Put,
  Get
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/src/resources/common/public.decorator';
import { LoginUserDto } from '../../users/src/models';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UserRoles } from '../../common/src/resources/users';
import { UsersService } from '../../users/src/users.service';
import { PasswordHelper } from '../../common/src/utils/helpers/password.helper';
import { TranslatorService } from 'nestjs-translator';
import { RefreshSessionDto, SessionDataDto } from '../../sessions/src/models';
import { UserSessionDto } from '../../users/src/models/user-session.dto';
import { IsNotRequiredAdditionalAuthentication } from '../../common/src/resources/common/is-not-required-additional-authentication.decorator';
import { SessionDynamicParamsDto } from '../../sessions/src/models/session-dynamic-params.dto';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { AdditionalAuthenticationsService } from '../../additional-authentications/src/additional-authentications.service';

@ApiTags('admins')
@Controller('admins')
export class AdminsSessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly additionalAuthenticationsService: AdditionalAuthenticationsService
  ) {}

  @Public()
  @ApiResponse({ type: () => UserSessionDto })
  @ApiOperation({ summary: 'Start session' })
  @Post('sessions')
  async createAdmins(@Body() body: LoginUserDto): Promise<UserSessionDto> {
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

    const sessionOptions = { role: user.role, lifeTime: body.lifeTime, email: user.email };
    const sessionResult = await this.sessionsService.create(
      user.id,
      sessionOptions,
      {
        isDeviceVerified: !user.additionalAuthenticationType,
        additionalAuthenticationType: user.additionalAuthenticationType,
        isAdditionalAuthenticationDeclined: false
      }
    );

    const cachedSession = await this.sessionsService.findSession(sessionResult.accessToken);

    if (user.additionalAuthenticationType) {
      await this.additionalAuthenticationsService.sendAdditionalAuthentication(user, body.additionalAuthenticationType || user.additionalAuthenticationType, cachedSession.sessionId, body.deviceId);
    }

    return new UserSessionDto(sessionResult, user);
  }

  @Public()
  @ApiCreatedResponse({ type: () => UserSessionDto })
  @ApiOperation({ summary: 'Refresh session' })
  @Put('sessions')
  async refresh(@Body() body: RefreshSessionDto): Promise<UserSessionDto> {
    const oldSessionParams = this.sessionsService.verifyToken(body.refreshToken);

    const scopes = [
      { method: ['byRoles', [UserRoles.superAdmin]] }
    ];

    const user = await this.usersService.getUser(oldSessionParams.data.userId, scopes);

    if (!user) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }
    const sessionResult = await this.sessionsService.refresh(body.refreshToken);
    return new UserSessionDto(sessionResult, user);
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

  @IsNotRequiredAdditionalAuthentication()
  @ApiBearerAuth()
  @ApiResponse({ type: () => SessionDynamicParamsDto })
  @ApiOperation({ summary: 'Get session dynamic params' })
  @Roles(UserRoles.superAdmin)
  @Get('/sessions/dynamic-params')
  async getSessionDynamicParams(@Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<SessionDynamicParamsDto> {
    return new SessionDynamicParamsDto(req.user);
  }
}
