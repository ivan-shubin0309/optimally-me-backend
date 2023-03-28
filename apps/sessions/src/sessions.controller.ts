import {
  Post,
  Body,
  Controller,
  Delete,
  Request,
  Put,
  UnprocessableEntityException,
  HttpStatus,
  Headers,
  HttpCode,
  Query,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/src/resources/common/public.decorator';
import { LoginUserDto } from '../../users/src/models';
import { RefreshSessionDto, SessionDataDto, SessionDto } from '../../sessions/src/models';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UserRoles } from '../../common/src/resources/users';
import { UsersService } from '../../users/src/users.service';
import { PasswordHelper } from '../../common/src/utils/helpers/password.helper';
import { TranslatorService } from 'nestjs-translator';
import { UserSessionDto } from '../../users/src/models/user-session.dto';
import { GetShopifyUrl } from './models/get-shopify-url.dto';
import { ShopifyUrlDto } from './models/shopify-url.dto';
import { ShopifyUrlHelper } from '../../common/src/resources/shopify/shopify-url.helper';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { RegistrationSteps } from '../../common/src/resources/users/registration-steps';
import { AllowedRegistrationSteps } from '../../common/src/resources/common/registration-step.decorator';
import { EnumHelper } from '../../common/src/utils/helpers/enum.helper';
import { UsersDevicesService } from '../../users-devices/src/users-devices.service';
import { UserCodesService } from './user-codes.service';
import { UserCodeDto } from './models/user-code.dto';
import { GetUserSessionByCodeDto } from './models/get-user-session-by-code.dto';
import { DateTime } from 'luxon';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly configService: ConfigService,
    private readonly usersDevicesService: UsersDevicesService,
    private readonly userCodesService: UserCodesService,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: () => UserSessionDto })
  @ApiOperation({ summary: 'Start session' })
  @Post('')
  async create(@Body() body: LoginUserDto): Promise<UserSessionDto> {
    const scopes = [
      { method: ['byRoles', [UserRoles.user]] },
      'withAdditionalField'
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

    const session = await this.sessionsService.create(user.id, {
      role: user.role,
      email: user.email,
      registrationStep: user?.additionalField?.registrationStep || RegistrationSteps.profileSetup,
      isEmailVerified: !!user?.additionalField?.isEmailVerified,
      lifeTime: body.lifeTime
    });

    await this.userCodesService.generateCode(user.id, session.accessToken, session.refreshToken, session.expiresAt);

    return new UserSessionDto(session, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Destroy session' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  async logout(@Request() request, @Headers('Authorization') accessToken): Promise<void> {
    const { user } = request;

    accessToken = accessToken.split(' ')[1];

    await this.sessionsService.destroy(user.userId, accessToken);

    await this.usersDevicesService.removeDeviceBySessionId(user.sessionId);
  }

  @Public()
  @AllowedRegistrationSteps(
    EnumHelper
      .toCollection(RegistrationSteps)
      .map(registrationStep => registrationStep.value) as any
    )
  @ApiCreatedResponse({ type: () => UserSessionDto })
  @ApiOperation({ summary: 'Refresh session' })
  @Put('')
  async refresh(@Body() body: RefreshSessionDto): Promise<UserSessionDto> {
    const oldSessionParams = this.sessionsService.verifyToken(body.refreshToken);

    const scopes = [
      { method: ['byRoles', [UserRoles.user]] }
    ];

    const user = await this.usersService.getUser(oldSessionParams.data.userId, scopes);

    if (!user) {
      throw new UnprocessableEntityException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
      });
    }

    const session = await this.sessionsService.refresh(body.refreshToken);

    return new UserSessionDto(session, user);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: () => ShopifyUrlDto })
  @ApiOperation({ summary: 'Get shopify sign in url' })
  @Roles(UserRoles.user)
  @Get('/shopify')
  async getShopifySignIn(@Query() query: GetShopifyUrl, @Headers('Authorization') bearer): Promise<ShopifyUrlDto> {
    const accessToken = bearer.split(' ')[1];

    return new ShopifyUrlDto(ShopifyUrlHelper.getSignInUrl(query.redirectUrl, this.configService.get('SHOPIFY_CUSTOMER_ID'), this.configService.get('SHOPIFY_IDP_IDENTIFIER'), accessToken));
  }

  @ApiBearerAuth()
  @ApiResponse({ type: () => UserCodeDto })
  @ApiOperation({ summary: 'Get code for login with qrcode' })
  @Get('/codes')
  async getLoginCode(@Request() req: Request & { user: SessionDataDto }): Promise<UserCodeDto> {
    const userCode = await this.userCodesService.getOne([ { method: ['byUserId', req.user.userId] } ]);

    if(!userCode) {
      throw new NotFoundException({
        message: this.translator.translate('USER_CODE_NOT_FOUND'),
        errorCode: 'USER_CODE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    return new UserCodeDto(userCode);
  }

  @Public()
  @ApiResponse({ type: () => UserSessionDto })
  @ApiOperation({ summary: 'Get session by user code' })
  @Post('/codes')
  async getUserSessionByCode(@Body() body: GetUserSessionByCodeDto): Promise<UserSessionDto> {
    const userCode = await this.userCodesService.getOne([ { method: ['byCode', body.code] } ]);

    if(!userCode) {
      throw new NotFoundException({
        message: this.translator.translate('USER_CODE_NOT_FOUND'),
        errorCode: 'USER_CODE_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const user = await this.usersService.getOne([
      { method: ['byId', userCode.userId] },      
      { method: ['byRoles', [UserRoles.user]] },
      'withAdditionalField'
    ]);

    const sessionData = await this.sessionsService.findSession(userCode.sessionToken);

    if(!sessionData) {
      throw new NotFoundException({
        message: this.translator.translate('SESSION_NOT_FOUND'),
        errorCode: 'SESSION_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    return new UserSessionDto(new SessionDto(userCode.sessionToken, userCode.refreshToken, DateTime.fromJSDate(userCode.expiresAt).valueOf()), user);
  }
}
