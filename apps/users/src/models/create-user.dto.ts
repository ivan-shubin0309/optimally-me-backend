import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UsersValidationRules } from '../../../common/src/resources/users';

export class CreateUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @MaxLength(UsersValidationRules.passwordMaxLength)
    readonly password: string;
}
