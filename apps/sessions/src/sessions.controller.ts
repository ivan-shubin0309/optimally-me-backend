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
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/src/resources/common/public.decorator';
import { LoginUserDto } from '../../users/src/models';
import { RefreshSessionDto } from '../../sessions/src/models';
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

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: () => UserSessionDto })
  @ApiOperation({ summary: 'Start session' })
  @Post('')
  async create(@Body() body: LoginUserDto): Promise<UserSessionDto> {
    const scopes = [
      { method: ['byRoles', [UserRoles.user]] }
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
      lifeTime: body.lifeTime
    });

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
  }

  @Public()
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
}
