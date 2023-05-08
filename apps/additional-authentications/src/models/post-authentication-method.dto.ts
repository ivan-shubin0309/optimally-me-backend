import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { AdditionalAuthenticationTypes } from '../../../common/src/resources/users-mfa-devices/additional-authentication-types';

export class PostAuthenticationMethodDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(AdditionalAuthenticationTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(AdditionalAuthenticationTypes)
    readonly authenticationMethod: number;
}
