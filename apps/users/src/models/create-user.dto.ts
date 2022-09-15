import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UsersValidationRules } from '../../../common/src/resources/users';

export class CreateUserDto {
    @ApiProperty({ type: () => String, required: false })
    readonly username: string;

    @ApiProperty({ type: () => String, required: true })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @MaxLength(UsersValidationRules.passwordMaxLength)
    readonly password: string;
}
