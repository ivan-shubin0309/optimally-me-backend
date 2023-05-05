import { Injectable } from '@nestjs/common';
import { UsersDevicesService } from '../../users-devices/src/users-devices.service';
import { AdditionalAuthenticationTypes } from '../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { User } from '../../users/src/models';
import { VerificationsService } from '../../verifications/src/verifications.service';
import { ADDITIONAL_AUTHENTICATION_CODE_LENGTH, ADDITIONAL_AUTHENTICATION_TOKEN_EXPIRE } from '../../common/src/resources/verificationTokens/constants';
import { TokenTypes } from '../../common/src/resources/verificationTokens/token-types';
import { MailerService } from '../../common/src/resources/mailer/mailer.service';

@Injectable()
export class AdditionalAuthenticationsService {
    constructor(
        private readonly usersDevicesService: UsersDevicesService,
        private readonly verificationsService: VerificationsService,
        private readonly mailerService: MailerService
    ) { }

    async sendAdditionalAuthentication(user: User, authenticationMethod: AdditionalAuthenticationTypes, sessionId: string, deviceId?: string): Promise<void> {
        const token = await this.verificationsService.generateToken({ sessionId, authenticationMethod, deviceId }, ADDITIONAL_AUTHENTICATION_TOKEN_EXPIRE);
        const verificationToken = await this.verificationsService.saveToken(user.id, token, TokenTypes.additionalAuthentication, { isExpirePreviousTokens: true, digitCodeLength: ADDITIONAL_AUTHENTICATION_CODE_LENGTH });

        if (authenticationMethod === AdditionalAuthenticationTypes.email) {
            await this.mailerService.sendEmailFactorAuthenticationEmail(user, verificationToken.code);
        }

        if (authenticationMethod === AdditionalAuthenticationTypes.mfa) {
            //TO DO
        }
    }
}
