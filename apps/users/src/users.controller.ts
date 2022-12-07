import {
    Get,
    Post,
    Body,
    Controller,
    Request,
    HttpCode,
    HttpStatus,
    BadRequestException,
    Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { WefitterService } from '../../wefitter/src/wefitter.service';
import { Public } from '../../common/src/resources/common/public.decorator';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserDto, CreateUserDto } from './models';
import { UserRoles } from '../../common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';
import { Sequelize } from 'sequelize-typescript';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { EMAIL_TOKEN_EXPIRE } from '../../common/src/resources/verificationTokens/constants';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { NotRequiredEmailVerification } from '../../common/src/resources/common/not-required-email-verification.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly wefitterService: WefitterService,
        private readonly translator: TranslatorService,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly verificationsService: VerificationsService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    @Roles(UserRoles.user)
    @NotRequiredEmailVerification()
    @ApiBearerAuth()
    @ApiResponse({ type: () => UserDto })
    @ApiOperation({ summary: 'Get current user\'s profile' })
    @Get('me')
    async getMyProfile(@Request() req): Promise<UserDto> {
        const user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['byRoles', UserRoles.user] },
            'withAdditionalField'
        ]);

        return new UserDto(user);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Register user' })
    @Post('signup')
    async create(@Body() body: CreateUserDto): Promise<object> {
        let createdUser;

        const user = await this.usersService.getUserByEmail(body.email);

        if (user) {
            throw new BadRequestException({
                message: this.translator.translate('USER_ALREADY_EXIST'),
                errorCode: 'USER_ALREADY_EXIST',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.dbConnection.transaction(async transaction => {
            createdUser = await this.usersService.createWithAdditionalFields(body, transaction);

            await this.wefitterService.createProfile(createdUser, transaction);
        });

        const token = await this.verificationsService.generateToken({ userId: createdUser.id }, EMAIL_TOKEN_EXPIRE);
        await this.verificationsService.saveToken(createdUser.id, token, TokenTypes.email, true);

        await this.mailerService.sendUserVerificationEmail(createdUser, token);

        return {};
    }
}
