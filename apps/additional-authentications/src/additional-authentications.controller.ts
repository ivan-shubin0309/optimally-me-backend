import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Inject, NotFoundException, Patch, Post, Put, Query, Request, UnprocessableEntityException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { AdditionalAuthenticationsService } from './additional-authentications.service';
import { PostAuthenticationMethodDto } from './models/post-authentication-method.dto';
import { AdditionalAuthenticationTypes } from '../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { TranslatorService } from 'nestjs-translator';
import { UsersService } from '../../users/src/users.service';
import { PostAuthCodeDto } from './models/post-auth-code.dto';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { Sequelize } from 'sequelize-typescript';
import { SessionsService } from '../../sessions/src/sessions.service';
import { IsNotRequiredAdditionalAuthentication } from '../../common/src/resources/common/is-not-required-additional-authentication.decorator';
import { UsersVerifiedDevicesService } from './users-verified-devices.service';
import { PutAuthCodeDto } from './models/put-auth-code.dto';

@ApiBearerAuth()
@ApiTags('users/additional-authentications')
@Controller('users/additional-authentications')
export class AdditionalAuthenticationsController {
    constructor(
        private readonly additionalAuthenticationsService: AdditionalAuthenticationsService,
        private readonly translator: TranslatorService,
        private readonly usersService: UsersService,
        private readonly verificationsService: VerificationsService,
        @Inject('SEQUELIZE') private readonly dbConnection: Sequelize,
        private readonly sessionsService: SessionsService,
        private readonly usersVerifiedDevicesService: UsersVerifiedDevicesService,
    ) { }

    @ApiOperation({ summary: 'Set additional authentication method' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRoles.user, UserRoles.superAdmin)
    @Post()
    async setAdditionalAuthenticationMethod(@Body() body: PostAuthenticationMethodDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        const user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['withAdditionalField'] }
        ]);

        if (user.additionalAuthenticationType) {
            throw new BadRequestException({
                message: this.translator.translate('ADDITIONAL_AUTHENTICATION_ALREADY_EXIST'),
                errorCode: 'ADDITIONAL_AUTHENTICATION_ALREADY_EXIST',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.additionalAuthenticationsService.sendAdditionalAuthentication(user, body.authenticationMethod, req.user.sessionId);

        const [cachedSession, accessToken] = await this.sessionsService.findSessionBySessionId(req.user.sessionId, user.id);
        cachedSession.isAdditionalAuthenticationDeclined = false;
        await this.sessionsService.updateSessionParams(accessToken, cachedSession);
    }

    @IsNotRequiredAdditionalAuthentication()
    @Roles(UserRoles.user, UserRoles.superAdmin)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Confirm additional authentication' })
    @Patch()
    async confirmAdditionalAuthentication(@Body() body: PostAuthCodeDto, @Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<void> {
        const verificationToken = await this.verificationsService.verifyCode(TokenTypes.additionalAuthentication, body.code, req.user.userId);

        const decoded = await this.verificationsService.decodeToken(verificationToken.token, 'CODE_IS_EXPIRED');

        if (
            decoded.data.authenticationMethod === AdditionalAuthenticationTypes.email
            && decoded.data.sessionId !== req.user.sessionId
        ) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('SESSION_ID_INVALID'),
                errorCode: 'SESSION_ID_INVALID',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        const user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] }
        ]);

        const [cachedSession, accessToken] = await this.sessionsService.findSessionBySessionId(decoded.data.sessionId, user.id);

        if (!cachedSession) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('SESSION_ID_INVALID'),
                errorCode: 'SESSION_ID_INVALID',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        await this.dbConnection.transaction(async transaction => {
            if (
                !user.additionalAuthenticationType
                || decoded.data.isAuthenticationMethodRewrite
            ) {
                await user.update({ additionalAuthenticationType: decoded.data.authenticationMethod }, { transaction });
                if (decoded.data.authenticationMethod === AdditionalAuthenticationTypes.mfa) {
                    const mfaDevice = await this.usersVerifiedDevicesService.getOne([
                        { method: ['byUserId', user.id] },
                        { method: ['byIsMfaDevice', true] }
                    ], transaction);
                    await mfaDevice.update({ deviceId: req.user.deviceId }, { transaction });
                }
            }

            if (decoded.data.deviceId) {
                await this.usersVerifiedDevicesService.create({
                    userId: user.id,
                    deviceId: decoded.data.deviceId,
                    isMfaDevice: false
                });
            }

            await verificationToken.update({ isUsed: true }, { transaction });
        });

        cachedSession.isDeviceVerified = true;
        cachedSession.additionalAuthenticationType = user.additionalAuthenticationType;
        await this.sessionsService.updateSessionParams(accessToken, cachedSession);
    }

    @IsNotRequiredAdditionalAuthentication()
    @Roles(UserRoles.user, UserRoles.superAdmin)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Verify code for additional authentication' })
    @Get()
    async verifyCode(@Query() query: PostAuthCodeDto, @Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<void> {
        const verificationToken = await this.verificationsService.verifyCode(TokenTypes.additionalAuthentication, query.code);

        const decoded = await this.verificationsService.decodeToken(verificationToken.token, 'CODE_IS_EXPIRED');

        if (
            decoded.data.authenticationMethod === AdditionalAuthenticationTypes.email
            && decoded.data.sessionId !== req.user.sessionId
        ) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('SESSION_ID_INVALID'),
                errorCode: 'SESSION_ID_INVALID',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }
    }

    @IsNotRequiredAdditionalAuthentication()
    @ApiOperation({ summary: 'Resend additional authentication code' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRoles.user, UserRoles.superAdmin)
    @Put()
    async resendAdditionalAuthenticationCode(@Body() body: PutAuthCodeDto, @Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<void> {
        let sessionId, authenticationMethod, deviceId, isAuthenticationMethodRewrite;

        const user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] },
            'withAdditionalField'
        ]);

        if (body.code) {
            const verificationToken = await this.verificationsService.getOne([
                { method: ['byUserId', req.user.userId] },
                { method: ['byType', TokenTypes.additionalAuthentication] },
                { method: ['byCode', body.code] }
            ]);

            if (!verificationToken) {
                throw new BadRequestException({
                    message: this.translator.translate('CODE_INVALID'),
                    errorCode: 'CODE_INVALID',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }

            await verificationToken.update({ isUsed: true });

            const decoded = await this.verificationsService.decodeToken(verificationToken.token, 'CODE_IS_EXPIRED', true);
            sessionId = decoded.data.sessionId;
            authenticationMethod = body.authenticationMethod || decoded.data.authenticationMethod;
            deviceId = decoded.data.deviceId;
            isAuthenticationMethodRewrite = decoded.data.isAuthenticationMethodRewrite;
        } else {
            sessionId = req.user.sessionId;
            authenticationMethod = body.authenticationMethod || user.additionalAuthenticationType;
            deviceId = req.user.deviceId;
            isAuthenticationMethodRewrite = false;
        }

        const [cachedSession, accessToken] = await this.sessionsService.findSessionBySessionId(sessionId, user.id);

        if (!cachedSession) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('SESSION_ID_INVALID'),
                errorCode: 'SESSION_ID_INVALID',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        if (user.additionalAuthenticationType && user.additionalAuthenticationType === body.authenticationMethod && cachedSession.isDeviceVerified) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('DEVICE_ALREADY_VERIFIED'),
                errorCode: 'DEVICE_ALREADY_VERIFIED',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        cachedSession.isAdditionalAuthenticationDeclined = false;
        await this.sessionsService.updateSessionParams(accessToken, cachedSession);
        await this.additionalAuthenticationsService.sendAdditionalAuthentication(user, authenticationMethod, sessionId, deviceId, { isAuthenticationMethodRewrite });
    }

    @ApiOperation({ summary: 'Reject additional authentication' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRoles.user, UserRoles.superAdmin)
    @Delete()
    async declineVerification(@Body() body: PostAuthCodeDto, @Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<void> {
        const verificationToken = await this.verificationsService.verifyCode(TokenTypes.additionalAuthentication, body.code);

        const decoded = await this.verificationsService.decodeToken(verificationToken.token, 'CODE_IS_EXPIRED');

        if (
            decoded.data.authenticationMethod === AdditionalAuthenticationTypes.email
            && decoded.data.sessionId !== req.user.sessionId
        ) {
            throw new UnprocessableEntityException({
                message: this.translator.translate('SESSION_ID_INVALID'),
                errorCode: 'SESSION_ID_INVALID',
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY
            });
        }

        const user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] },
            'withAdditionalField'
        ]);

        await verificationToken.update({ isUsed: true });

        const [cachedSession, accessToken] = await this.sessionsService.findSessionBySessionId(decoded.data.sessionId, user.id);
        cachedSession.isAdditionalAuthenticationDeclined = true;
        await this.sessionsService.updateSessionParams(accessToken, cachedSession);
    }

    @ApiOperation({ summary: 'Change additional authentication method' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRoles.user)
    @Patch('/additional-authentication-type')
    async changeAdditionalAuthenticationMethod(@Body() body: PostAuthenticationMethodDto, @Request() req: Request & { user: SessionDataDto }): Promise<void> {
        const user = await this.usersService.getOne([
            { method: ['byId', req.user.userId] },
            { method: ['withAdditionalField'] }
        ]);

        if (!user.additionalAuthenticationType) {
            throw new BadRequestException({
                message: this.translator.translate('ADDITIONAL_AUTHENTICATION_NOT_SET'),
                errorCode: 'ADDITIONAL_AUTHENTICATION_NOT_SET',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.additionalAuthenticationsService.sendAdditionalAuthentication(user, body.authenticationMethod, req.user.sessionId, null, { isAuthenticationMethodRewrite: true });

        const [cachedSession, accessToken] = await this.sessionsService.findSessionBySessionId(req.user.sessionId, user.id);
        cachedSession.isAdditionalAuthenticationDeclined = false;
        await this.sessionsService.updateSessionParams(accessToken, cachedSession);
    }
}
