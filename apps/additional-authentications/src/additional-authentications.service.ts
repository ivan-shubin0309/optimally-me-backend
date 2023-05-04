import { Injectable } from '@nestjs/common';
import { AdditionalAuthenticationTypes } from '../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { User } from '../../users/src/models';

@Injectable()
export class AdditionalAuthenticationsService {
    async setAdditionalAuthentication(user: User, authenticationMethod: AdditionalAuthenticationTypes, deviceToken?: string): Promise<void> {

    }
}
