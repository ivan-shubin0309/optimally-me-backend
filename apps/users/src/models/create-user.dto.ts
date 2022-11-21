import { IsNotEmpty, IsEmail, MaxLength, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UsersValidationRules } from '../../../common/src/resources/users';
import { CreateUserAdditionalFieldDto } from './create-user-additional-field.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @MaxLength(UsersValidationRules.passwordMaxLength)
    readonly password: string;

    @ApiProperty({ type: () => CreateUserAdditionalFieldDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateUserAdditionalFieldDto)
    readonly additionalFields: CreateUserAdditionalFieldDto;
}
