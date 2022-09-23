import { IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { INVALID_EMAIL_ERROR_MESSAGE } from '../../../common/src/resources/users';

export class LoginUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail({},{
        message: INVALID_EMAIL_ERROR_MESSAGE
    })
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lifeTime: number;
}
