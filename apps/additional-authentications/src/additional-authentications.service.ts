import { BadRequestException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersDevicesService } from '../../users-devices/src/users-devices.service';
import { AdditionalAuthenticationTypes } from '../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { User } from '../../users/src/models';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { ADDITIONAL_AUTHENTICATION_CODE_LENGTH, ADDITIONAL_AUTHENTICATION_TOKEN_EXPIRE } from '../../common/src/resources/verificationTokens/constants';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';
import { TranslatorService } from 'nestjs-translator';
import { UsersVerifiedDevicesService } from './users-verified-devices.service';
import { PushNotificationsService } from '../../users-devices/src/push-notifications.service';

@Injectable()
export class AdditionalAuthenticationsService {
    constructor(
        private readonly usersDevicesService: UsersDevicesService,
        private readonly verificationsService: VerificationsService,
        private readonly mailerService: MailerService,
        private readonly translator: TranslatorService,
        private readonly usersVerifiedDevicesService: UsersVerifiedDevicesService,
        private readonly pushNotificationsService: PushNotificationsService,
    ) { }

    async sendAdditionalAuthentication(user: User, authenticationMethod: AdditionalAuthenticationTypes, sessionId: string, deviceId?: string): Promise<void> {
        const token = await this.verificationsService.generateToken({ sessionId, authenticationMethod, deviceId }, ADDITIONAL_AUTHENTICATION_TOKEN_EXPIRE);
        const verificationToken = await this.verificationsService.saveToken(user.id, token, TokenTypes.additionalAuthentication, { isExpirePreviousTokens: true, digitCodeLength: ADDITIONAL_AUTHENTICATION_CODE_LENGTH });

        if (authenticationMethod === AdditionalAuthenticationTypes.email) {
            await this.mailerService.sendEmailFactorAuthenticationEmail(user, verificationToken.code);

            if (deviceId) {
                await this.usersVerifiedDevicesService.create({
                    userId: user.id,
                    deviceId,
                    isMfaDevice: false
                });
            }
        }

        if (authenticationMethod === AdditionalAuthenticationTypes.mfa) {
            const mfaDevice = await this.usersVerifiedDevicesService.getOne([
                { method: ['byUserId', user.id] },
                { method: ['byIsMfaDevice', true] }
            ]);

            if (mfaDevice) {
                await this.pushNotificationsService.sendPushNotification(); //TO DO
            } else {
                if (!deviceId) {
                    throw new BadRequestException({
                        message: this.translator.translate('DEVICE_ID_REQUIRED'),
                        errorCode: 'DEVICE_ID_REQUIRED',
                        statusCode: HttpStatus.BAD_REQUEST
                    });
                }

                const userDevice = await this.usersDevicesService.getOne([
                    { method: ['byUserId', user.id] }
                ]);

                if (!userDevice) {
                    throw new UnprocessableEntityException({
                        message: this.translator.translate('USER_DEVICE_NOT_FOUND'),
                        errorCode: 'USER_DEVICE_NOT_FOUND',
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                    });
                }

                await this.usersVerifiedDevicesService.create({
                    userId: user.id,
                    deviceId,
                    deviceToken: userDevice.token,
                    isMfaDevice: true
                });
            }
        }
    }
}
