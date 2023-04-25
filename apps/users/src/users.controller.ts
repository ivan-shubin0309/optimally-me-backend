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
    Headers,
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
import { RegistrationSteps } from '../../common/src/resources/users/registration-steps';
import { AllowedRegistrationSteps } from '../../common/src/resources/common/registration-step.decorator';
import { UserSessionDto } from './models/user-session.dto';
import { CreateUserAdditionalFieldDto } from './models/create-user-additional-field.dto';
import { SessionsService } from '../../sessions/src/sessions.service';
import { EnumHelper } from '../../common/src/utils/helpers/enum.helper';
import { UserCodesService } from '../../sessions/src/user-codes.service';
import { KlaviyoModelService } from '../../klaviyo/src/klaviyo-model.service';
import { KlaviyoService } from '../../klaviyo/src/klaviyo.service';
import { KlaviyoEventTypes } from '../../common/src/resources/klaviyo/klaviyo-event-types';

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
        private readonly sessionsService: SessionsService,
        private readonly userCodesService: UserCodesService,
        private readonly klaviyoModelService: KlaviyoModelService,
        private readonly klaviyoService: KlaviyoService,
    ) {}

    @Roles(UserRoles.user)
    @ApiBearerAuth()
    @AllowedRegistrationSteps(
        ...EnumHelper
            .toCollection(RegistrationSteps)
            .map(registrationStep => registrationStep.value) as any
    )
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

        await this.mailerService.sendUserVerificationEmail(createdUser, token, body.queryString);

        return {};
    }

    @Roles(UserRoles.user)
    @AllowedRegistrationSteps(RegistrationSteps.profileSetup)
    @ApiBearerAuth()
    @ApiResponse({ type: () => UserSessionDto })
    @ApiOperation({ summary: 'Finish user registration' })
    @Post('profile')
    async finishRegistration(@Request() req, @Body() body: CreateUserAdditionalFieldDto, @Headers('Authorization') bearer): Promise<UserSessionDto> {
        let user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['byRoles', UserRoles.user] },
            'withAdditionalField'
        ]);

        await this.dbConnection.transaction(async transaction => {
            await user.update({ firstName: body.firstName, lastName: body.lastName }, { transaction });
            await user.additionalField.update(
                {
                    registrationStep: RegistrationSteps.finished,
                    dateOfBirth: body.dateOfBirth,
                    sex: body.sex
                },
                { transaction }
            );

            user = await user.reload();

            await this.klaviyoModelService.getKlaviyoProfile(user, transaction);
            await this.klaviyoService.createEvent(user.email, KlaviyoEventTypes.accountCreated, ''); //TO DO add source
        });

        const accessToken = bearer.split(' ')[1];

        await this.sessionsService.destroy(user.id, accessToken);

        const session = await this.sessionsService.create(user.id, {
            role: user.role,
            email: user.email,
            registrationStep: user.additionalField.registrationStep,
            isEmailVerified: user.additionalField.isEmailVerified,
        });

        await this.userCodesService.generateCode(user.id, session.accessToken, session.refreshToken, session.expiresAt);

        return new UserSessionDto(session, user);
    }
}
