import { SetMetadata } from '@nestjs/common';
import { RegistrationSteps } from '../users/registration-steps';

export const AllowedRegistrationSteps = (...registrationSteps: RegistrationSteps[]) => SetMetadata('registrationSteps', registrationSteps);
