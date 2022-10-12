import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Patch, Post, Inject, Get, Query, Response } from '@nestjs/common';
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
import { UserSessionDto } from 'apps/users/src/models/user-session.dto';

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
        const scopes = [
            { method: ['byRoles', [UserRoles.user]] }
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
        await this.verificationsService.saveToken(user.id, token, TokenTypes.userPassword, true);

        await this.mailerService.sendUserRestorePasswordEmail(user, `${this.configService.get('SWAGGER_BACKEND_URL')}/verifications/password/redirect?token=${token}`);
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

        const user = await this.usersService.getUser(decoded.data.userId);

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
    @ApiOperation({ summary: 'Redirect code to mobile app' })
    @Get('password/redirect')
    async redirectToRestorePassword(@Query() query: VerificationTokenDto, @Response() response): Promise<void> {
        response.set('Content-Type', 'text/html');
        response.send(Buffer.from(`<!DOCTYPE html><html><head><title></title><meta charset="UTF-8" /><meta http-equiv="refresh" content="3; URL=${this.configService.get('MOBILE_FRONTEND_BASE_URL')}restore-password?code=${query.token}" /></head><body></body></html>`));
    }
}
