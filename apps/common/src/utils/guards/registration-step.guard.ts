import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RegistrationSteps } from '../../resources/users/registration-steps';

@Injectable()
export class RegistrationStepGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const registrationSteps = this.reflector.get<number[]>(
            'registrationSteps',
            context.getHandler()
        );
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return true;
        }
        if (!registrationSteps) {
            return !user.registrationStep || user.registrationStep === RegistrationSteps.finished;
        }
        return registrationSteps.includes(user.registrationStep);
    }
}
