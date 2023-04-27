import { IsNotEmpty, IsEmail, MaxLength, MinLength, Matches, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX, UsersValidationRules } from '../../../common/src/resources/users';
import { RegistrationSources } from '../../../common/src/resources/users/registration-sources';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';

export class CreateUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @MinLength(UsersValidationRules.passwordMinLength)
    @MaxLength(UsersValidationRules.passwordMaxLength)
    @Matches(PASSWORD_REGEX, { message: `password ${PASSWORD_ERROR_MESSAGE}` })
    readonly password: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RegistrationSources) })
    @IsOptional()
    @IsNumber()
    @IsEnum(RegistrationSources)
    readonly registrationSource: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly queryString: string;
}
