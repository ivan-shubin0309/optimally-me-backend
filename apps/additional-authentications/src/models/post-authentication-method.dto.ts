import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { AdditionalAuthenticationTypes } from '../../../common/src/resources/users-mfa-devices/additional-authentication-types';
import { Transform, TransformFnParams } from 'class-transformer';

export class PostAuthenticationMethodDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(AdditionalAuthenticationTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(AdditionalAuthenticationTypes)
    readonly authenticationMethod: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly deviceToken: string;
}
