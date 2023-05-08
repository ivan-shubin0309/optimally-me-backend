import { IsNotEmpty, IsOptional, IsEmail, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { AdditionalAuthenticationTypes } from '../../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';

export class LoginUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lifeTime: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @MaxLength(255)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly deviceId: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(AdditionalAuthenticationTypes) })
    @IsOptional()
    @IsEnum(AdditionalAuthenticationTypes)
    readonly additionalAuthenticationType: number;
}
