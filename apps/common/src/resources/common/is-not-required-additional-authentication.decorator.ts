import { SetMetadata } from '@nestjs/common';

export const IS_NOT_REQUIRED_ADDITIONAL_AUTHENTICATION_KEY = 'isNotRequiredAdditionalAuthentication';
export const IsNotRequiredAdditionalAuthentication = () => SetMetadata(IS_NOT_REQUIRED_ADDITIONAL_AUTHENTICATION_KEY, true);