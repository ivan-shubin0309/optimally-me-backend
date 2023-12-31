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
import { registrationSourceClientValue } from '../../common/src/resources/users/registration-sources';
import { SexClientValues } from '../../common/src/resources/filters/sex-types';
import { IsNotRequiredAdditionalAuthentication } from '../../common/src/resources/common/is-not-required-additional-authentication.decorator';

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

    @IsNotRequiredAdditionalAuthentication()
    @Roles(UserRoles.user, UserRoles.superAdmin)
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
        await this.verificationsService.saveToken(createdUser.id, token, TokenTypes.email, { isExpirePreviousTokens: true });

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
        const scopes: any[] = [
            { method: ['byId', req.user.userId] },
            { method: ['byRoles', UserRoles.user] },
            'withAdditionalField'
        ];
        let user = await this.usersService.getOne(scopes);

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

            user = await this.usersService.getOne(scopes, transaction);

            const klaviyoProfile = await this.klaviyoModelService.getKlaviyoProfile(user, transaction);
            await this.klaviyoService.patchProfile(
                {
                    type: 'profile',
                    attributes: {
                        first_name: body.firstName,
                        last_name: body.lastName,
                        properties: {
                            Accepts_Marketing: true,
                            Gender: SexClientValues[body.sex],
                            Date_of_Birth: body.dateOfBirth,
                            Self_Assessment_Quiz_Completed: false,
                        }
                    }
                },
                klaviyoProfile.klaviyoUserId
            );
        });

        await this.klaviyoService.createAccountEvent(
            user.email,
            registrationSourceClientValue[user.additionalField.registrationSource]
        );

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
