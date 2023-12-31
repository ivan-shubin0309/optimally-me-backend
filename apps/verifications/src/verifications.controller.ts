import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Patch, Post, Inject, Get, Query, Response, ForbiddenException, BadRequestException, UnprocessableEntityException, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { UserRoles } from '../../common/src/resources/users';
import { TranslatorService } from 'nestjs-translator';
import { VerificationTokenDto } from '../../common/src/models/verification-token.dto';
import { Public } from '../../common/src/resources/common/public.decorator';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { UsersService } from '../../users/src/users.service';
import { VerificationsService } from './verifications.service';
import { Sequelize } from 'sequelize-typescript';
import { RestorePasswordDto } from './models/restore-password.dto';
import { SetPasswordDto } from './models/set-password.dto';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UserSessionDto } from '../../users/src/models/user-session.dto';
import { DateTime } from 'luxon';
import { EMAIL_VERIFICATION_HOURS_LIMIT, EMAIL_VERIFICATION_LIMIT, RESTORATION_TOKEN_EXPIRE, RESTORE_PASSWORD_HOURS_LIMIT, RESTORE_PASSWORD_LIMIT } from '../../common/src/resources/verificationTokens/constants';
import { ResendEmailVerificationDto } from './models/resend-email-verification.dto';
import * as userAgent from 'express-useragent';
import { UserVerificationTokenDto } from './models/user-verification-token.dto';
import { RegistrationSteps } from '../../common/src/resources/users/registration-steps';

@ApiTags('verifications')
@Controller('verifications')
export class VerificationsController {
    constructor(
        private readonly verificationsService: VerificationsService,
        private readonly usersService: UsersService,
        private readonly translator: TranslatorService,
        private readonly mailerService: MailerService,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly configService: ConfigService,
        private readonly sessionsService: SessionsService,
    ) { }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Send restore password' })
    @Post('password')
    async sendRestorePassword(@Body() body: RestorePasswordDto): Promise<void> {
        const scopes: any[] = [{ method: ['byRoles', [UserRoles.user]] }];
        let link;

        if (body.email) {
            scopes.push({ method: ['byEmail', body.email] });
        }

        if (body.token) {
            const verificationToken = await this.verificationsService.getOne([
                { method: ['byType', TokenTypes.userPassword] },
                { method: ['byToken', body.token] }
            ]);

            if (!verificationToken) {
                throw new BadRequestException({
                    message: this.translator.translate('LINK_INVALID'),
                    errorCode: 'LINK_INVALID',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }

            scopes.push({ method: ['byId', verificationToken.userId] });
        }

        const user = await this.usersService.getOne(scopes);

        if (!user) {
            return;
        }

        const restorationCount = await this.verificationsService.getCount([
            { method: ['byType', TokenTypes.userPassword] },
            { method: ['byUserId', user.id] },
            { method: ['byAfterDate', DateTime.utc().minus({ hours: RESTORE_PASSWORD_HOURS_LIMIT }).toISO()] }
        ]);

        if (restorationCount >= RESTORE_PASSWORD_LIMIT) {
            throw new ForbiddenException({
                message: this.translator.translate('RESTORE_PASSWORD_LIMIT'),
                errorCode: 'RESTORE_PASSWORD_LIMIT',
                statusCode: HttpStatus.FORBIDDEN
            });
        }

        const token = await this.verificationsService.generateToken({ userId: user.id }, body.tokenLifeTime || RESTORATION_TOKEN_EXPIRE);
        await this.verificationsService.saveToken(user.id, token, TokenTypes.userPassword, { isExpirePreviousTokens: true });

        link = `${this.configService.get('SWAGGER_BACKEND_URL')}/verifications/password/redirect?token=${token}`;

        if (body.queryString) {
            link = `${link}&queryString=${encodeURIComponent(body.queryString)}`;
        }

        await this.mailerService.sendUserRestorePasswordEmail(user, link);
    }

    @Public()
    @ApiResponse({ type: () => UserSessionDto })
    @ApiOperation({ summary: 'Restore password' })
    @Patch('password')
    async restorePassword(@Body() body: SetPasswordDto): Promise<UserSessionDto> {
        const verificationToken = await this.verificationsService.getOne([
            { method: ['byType', TokenTypes.userPassword] },
            { method: ['byToken', body.token] }
        ]);

        await this.verificationsService.verifyToken(TokenTypes.userPassword, body.token);

        const decoded = await this.verificationsService.decodeToken(body.token, 'RESTORATION_LINK_EXPIRED');

        const user = await this.usersService.getOne([
            { method: ['byId', decoded.data.userId] },
            'withAdditionalField'
        ]);

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

        const session = await this.sessionsService.create(user.id, {
            role: user.role,
            email: user.email,
            registrationStep: user?.additionalField?.registrationStep || RegistrationSteps.profileSetup,
            isEmailVerified: !!user?.additionalField?.isEmailVerified,
            lifeTime: this.configService.get('JWT_EXPIRES_IN')
        });

        return new UserSessionDto(session, user);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Verify restore password token' })
    @Get('password')
    async verifyRestorePasswordToken(@Query() query: VerificationTokenDto): Promise<void> {
        await this.verificationsService.verifyToken(TokenTypes.userPassword, query.token);

        const decoded = await this.verificationsService.decodeToken(query.token, 'RESTORATION_LINK_EXPIRED');

        const user = await this.usersService.getOne([
            { method: ['byId', decoded.data.userId] },
            { method: ['byRoles', [UserRoles.user]] }
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
    @ApiOperation({ summary: 'Redirect after password reset' })
    @Get('password/redirect')
    async redirectToRestorePassword(@Query() query: UserVerificationTokenDto, @Response() response, @Headers('user-agent') userAgentSource: string): Promise<void> {
        const parsedUserAgent = userAgent.parse(userAgentSource);
        let link;

        if (parsedUserAgent.isMobile) {
            link = `${this.configService.get('MOBILE_FRONTEND_BASE_URL')}restore-password?code=${query.token}`;
        } else {
            link = `${this.configService.get('FRONTEND_BASE_URL')}/reset-password?token=${query.token}`;
        }

        if (query.queryString) {
            link = `${link}&${decodeURIComponent(query.queryString)}`;
        }

        response.set('Content-Type', 'text/html');
        response.send(Buffer.from(`<!DOCTYPE html><html><head><title></title><meta charset="UTF-8" /><meta http-equiv="refresh" content="3; URL=${link}" /></head><body></body></html>`));
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Verify user email' })
    @Post('email')
    async verifyEmail(@Body() body: VerificationTokenDto): Promise<void> {
        const verificationToken = await this.verificationsService.getOne([
            { method: ['byType', TokenTypes.email] },
            { method: ['byToken', body.token] }
        ]);

        if (!verificationToken) {
            throw new BadRequestException({
                message: this.translator.translate('LINK_INVALID'),
                errorCode: 'LINK_INVALID',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        if (verificationToken.isUsed) {
            throw new BadRequestException({
                message: this.translator.translate('LINK_IS_USED'),
                errorCode: 'LINK_IS_USED',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        const decoded = await this.verificationsService.decodeToken(body.token, 'EMAIL_VERIFICATION_LINK_EXPIRED');

        const user = await this.usersService.getOne([
            { method: ['byId', decoded.data.userId] },
            'withAdditionalField'
        ]);

        if (!user) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        if (user?.additionalField?.isEmailVerified) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('EMAIL_ALREADY_VERIFIED'),
                errorCode: 'EMAIL_ALREADY_VERIFIED',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        await this.verificationsService.verifyUser(user, verificationToken);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Resend email verification link' })
    @Patch('email')
    async resendEmailVerification(@Body() body: ResendEmailVerificationDto): Promise<void> {
        let user;

        if (body.token) {
            const verificationToken = await this.verificationsService.getOne([
                { method: ['byType', TokenTypes.email] },
                { method: ['byToken', body.token] }
            ]);

            if (!verificationToken) {
                throw new BadRequestException({
                    message: this.translator.translate('LINK_INVALID'),
                    errorCode: 'LINK_INVALID',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }

            user = await this.usersService.getOne([
                { method: ['byId', verificationToken.userId] },
                { method: ['byRoles', UserRoles.user] },
                'withAdditionalField'
            ]);

            await verificationToken.update({ isUsed: true });
        }

        if (body.email) {
            user = await this.usersService.getOne([
                { method: ['byEmail', body.email] },
                { method: ['byRoles', UserRoles.user] },
                'withAdditionalField'
            ]);
        }

        if (!user) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        if (user?.additionalField?.isEmailVerified) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('EMAIL_ALREADY_VERIFIED'),
                errorCode: 'EMAIL_ALREADY_VERIFIED',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        const restorationCount = await this.verificationsService.getCount([
            { method: ['byType', TokenTypes.email] },
            { method: ['byUserId', user.id] },
            { method: ['byAfterDate', DateTime.utc().minus({ hours: EMAIL_VERIFICATION_HOURS_LIMIT }).toISO()] }
        ]);

        if (restorationCount >= EMAIL_VERIFICATION_LIMIT) {
            throw new ForbiddenException({
                message: this.translator.translate('EMAIL_VERIFICATION_LIMIT'),
                errorCode: 'EMAIL_VERIFICATION_LIMIT',
                statusCode: HttpStatus.FORBIDDEN
            });
        }

        const token = await this.verificationsService.generateToken({ userId: user.id }, body.tokenLifeTime);
        await this.verificationsService.saveToken(user.id, token, TokenTypes.email, { isExpirePreviousTokens: true });

        await this.mailerService.sendUserVerificationEmail(user, token, body.queryString);
    }

    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Verify email verification token' })
    @Get('email')
    async verifyEmailToken(@Query() query: VerificationTokenDto): Promise<void> {
        await this.verificationsService.verifyToken(TokenTypes.email, query.token);

        const decoded = await this.verificationsService.decodeToken(query.token, 'VERIFICATION_LINK_EXPIRED');

        const user = await this.usersService.getOne([
            { method: ['byId', decoded.data.userId] },
            { method: ['byRoles', [UserRoles.user]] }
        ]);

        if (!user) {
            throw new NotFoundException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }
    }
}
