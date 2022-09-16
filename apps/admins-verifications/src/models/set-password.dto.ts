import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { UsersValidationRules } from '../../../common/src/resources/users';

export class SetPasswordDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @MaxLength(UsersValidationRules.passwordMaxLength)
    readonly password: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly token: string;
}