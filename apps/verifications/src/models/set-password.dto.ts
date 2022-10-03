import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX, UsersValidationRules } from '../../../common/src/resources/users';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class SetPasswordDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @Length(UsersValidationRules.passwordMinLength, UsersValidationRules.passwordMaxLength)
    @Matches(PASSWORD_REGEX, { message: `password ${PASSWORD_ERROR_MESSAGE}` })
    readonly password: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly token: string;
}