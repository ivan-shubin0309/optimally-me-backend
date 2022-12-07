import { SetMetadata } from '@nestjs/common';

export const NotRequiredEmailVerification = () => SetMetadata('isNotRequiredEmailVerification', true);
