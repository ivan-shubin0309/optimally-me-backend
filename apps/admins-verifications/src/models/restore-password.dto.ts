import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { INVALID_EMAIL_ERROR_MESSAGE } from '../../../common/src/resources/users';

export class RestorePasswordDto {

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail({},{
        message: INVALID_EMAIL_ERROR_MESSAGE
    })
    readonly email: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly tokenLifeTime: number;
}