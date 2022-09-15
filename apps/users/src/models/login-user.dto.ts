import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { UsersValidationRules } from '../../../common/src/resources/users';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ type: () => String, required: true })
    @MaxLength(UsersValidationRules.emailMaxLength)
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    readonly lifeTime: number;
}
