import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const isNotRequired = this.reflector.get<number[]>(
            'isNotRequiredEmailVerification',
            context.getHandler()
        );
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return true;
        }
        if (isNotRequired) {
            return true;
        }
        return !!user.isEmailVerified;
    }
}
