import { APP_GUARD } from '@nestjs/core';
import { AdditionalAuthenticationGuard } from './additional-authentication.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegistrationStepGuard } from './registration-step.guard';
import { RolesGuard } from './roles.guard';

export const guardProviders = [
    {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
    },
    {
        provide: APP_GUARD,
        useClass: RolesGuard,
    },
    {
        provide: APP_GUARD,
        useClass: RegistrationStepGuard
    },
    {
        provide: APP_GUARD,
        useClass: AdditionalAuthenticationGuard
    }
];
