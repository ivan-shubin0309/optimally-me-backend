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
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/src/resources/common/public.decorator';
import { LoginUserDto } from '../../users/src/models';
import { SessionDto, RefreshSessionDto } from '../../sessions/src/models';
import { AdminsSessionsService } from './admins-sessions.service';
import { UserRoles } from '../../common/src/resources/users';
import { UsersService } from '../../users/src/users.service';
import { PasswordHelper } from '../../common/src/utils/helpers/password.helper';
import { TranslatorService } from 'nestjs-translator';

@ApiTags('admins')
@Controller('admins')
export class AdminsSessionsController {
  constructor(
    private readonly adminsSessionsService: AdminsSessionsService,
    private readonly usersService: UsersService,
    private readonly translator: TranslatorService,
  ) {}

  @Public()
  @ApiCreatedResponse({ type: () => SessionDto })
  @ApiOperation({ summary: 'Start session' })
  @Post('sessions')
  async createAdmins(@Body() body: LoginUserDto): Promise<SessionDto> {
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

    return this.adminsSessionsService.create(user.id, {
      role: user.role,
      lifeTime: body.lifeTime
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Destroy session' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  async logout(@Request() request, @Headers() headers): Promise<void> {
    const { user } = request;

    const accessToken = headers['authorization'].split(' ')[1];

    await this.adminsSessionsService.destroy(user.userId, accessToken);
  }

  @Public()
  @ApiCreatedResponse({ type: () => SessionDto })
  @ApiOperation({ summary: 'Refresh session' })
  @Put('')
  async refresh(@Body() body: RefreshSessionDto): Promise<SessionDto> {
    const oldSessionParams = this.adminsSessionsService.verifyToken(body.refreshToken);

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

    return this.adminsSessionsService.refresh(body.refreshToken);
  }
}
