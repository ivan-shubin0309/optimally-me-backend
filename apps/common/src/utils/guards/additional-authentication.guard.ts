import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_NOT_REQUIRED_ADDITIONAL_AUTHENTICATION_KEY } from '../../resources/common/is-not-required-additional-authentication.decorator';

@Injectable()
export class AdditionalAuthenticationGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const isRequired = this.reflector.get<number[]>(
            IS_NOT_REQUIRED_ADDITIONAL_AUTHENTICATION_KEY,
            context.getHandler()
        );
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return true;
        }
        if (!isRequired) {
            return true;
        }
        return user.additionalAuthenticationType
            ? user.isDeviceVerified
            : true;
    }
}
