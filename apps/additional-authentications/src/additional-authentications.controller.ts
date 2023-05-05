import { BadRequestException, Body, Controller, Get, Headers, HttpCode, HttpStatus, Inject, NotFoundException, Patch, Post, Query, Request } from '@nestjs/common';
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
import { IsNotRequiredAdditionalAuthentication } from 'apps/common/src/resources/common/is-not-required-additional-authentication.decorator';

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
    ) { }

    @ApiOperation({ summary: 'Set additional authentication method' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(UserRoles.user)
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

        if (body.authenticationMethod === AdditionalAuthenticationTypes.mfa && !body.deviceId) {
            throw new BadRequestException({
                message: this.translator.translate('DEVICE_ID_REQUIRED'),
                errorCode: 'DEVICE_ID_REQUIRED',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        await this.additionalAuthenticationsService.sendAdditionalAuthentication(user, body.authenticationMethod, req.user.sessionId, body.deviceId);
    }

    @IsNotRequiredAdditionalAuthentication()
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Confirm additional authentication' })
    @Patch()
    async confirmAdditionalAuthentication(@Headers('Authorization') bearer, @Body() body: PostAuthCodeDto, @Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<void> {
        const accessToken = bearer.split(' ')[1];
        const verificationToken = await this.verificationsService.verifyCode(TokenTypes.additionalAuthentication, body.code, req.user.userId);

        const decoded = await this.verificationsService.decodeToken(verificationToken.token, 'VERIFICATION_LINK_EXPIRED');

        if (decoded.data.sessionId !== req.user.sessionId) {
            throw new NotFoundException({
                message: this.translator.translate('SESSION_ID_INVALID'),
                errorCode: 'SESSION_ID_INVALID',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        const user = await this.usersService.getOne([
            { method: ['byId', verificationToken.userId] },
            { method: ['byRoles', [UserRoles.user]] }
        ]);

        if (!user) {
            throw new NotFoundException({
                message: this.translator.translate('USER_NOT_FOUND'),
                errorCode: 'USER_NOT_FOUND',
                statusCode: HttpStatus.NOT_FOUND
            });
        }

        await this.dbConnection.transaction(async transaction => {
            if (!user.additionalAuthenticationType) {
                await user.update({ additionalAuthenticationType: decoded.data.authenticationMethod }, { transaction });
            }

            await verificationToken.update({ isUsed: true }, { transaction });
        });

        const cachedSession = Object.assign({}, req.user);
        cachedSession.isDeviceVerified = true;
        cachedSession.additionalAuthenticationType = user.additionalAuthenticationType;
        await this.sessionsService.updateSessionParams(accessToken, cachedSession);
    }

    @IsNotRequiredAdditionalAuthentication()
    @Roles(UserRoles.user)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Verify code for additional authentication' })
    @Get()
    async verifyCode(@Query() query: PostAuthCodeDto, @Request() req: Request & { user: SessionDataDto & { [key: string]: any } }): Promise<void> {
        const verificationToken = await this.verificationsService.verifyCode(TokenTypes.additionalAuthentication, query.code,);

        const decoded = await this.verificationsService.decodeToken(verificationToken.token, 'CODE_IS_EXPIRED');

        if (decoded.data.sessionId !== req.user.sessionId) {
            throw new NotFoundException({
                message: this.translator.translate('SESSION_ID_INVALID'),
                errorCode: 'SESSION_ID_INVALID',
                statusCode: HttpStatus.NOT_FOUND
            });
        }
    }
}
