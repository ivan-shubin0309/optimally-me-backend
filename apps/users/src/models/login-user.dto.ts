import { IsNotEmpty, IsOptional, IsEmail, MinLength, MaxLength, Contains } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { INVALID_EMAIL_ERROR_MESSAGE, INVALID_PASSWORD_ERROR_MESSAGE } from '../../../common/src/resources/users';

export class LoginUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail({},{
        message: INVALID_EMAIL_ERROR_MESSAGE
    })
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @MinLength(8, {
        message: INVALID_PASSWORD_ERROR_MESSAGE,
    })
    @MaxLength(50, {
        message: INVALID_PASSWORD_ERROR_MESSAGE,
    })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lifeTime: number;
}
