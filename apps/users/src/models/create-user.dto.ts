import { IsNotEmpty, IsEmail, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX, UsersValidationRules } from '../../../common/src/resources/users';

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
}
