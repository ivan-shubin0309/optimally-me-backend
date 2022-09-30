import { User } from 'apps/users/src/models';
import { VerificationToken } from './models/verification-token.entity';


export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'VERIFICATION_TOKEN_MODEL',
        useValue: VerificationToken
    }
];
