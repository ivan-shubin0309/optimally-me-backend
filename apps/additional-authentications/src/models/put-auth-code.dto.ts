import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdditionalAuthenticationTypes } from '../../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';

export class PutAuthCodeDto {
    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly code: string;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(AdditionalAuthenticationTypes) })
    @IsOptional()
    @IsNumber()
    @IsEnum(AdditionalAuthenticationTypes)
    readonly authenticationMethod: number;
}
