import { IsNumber, IsEnum, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SexTypes } from '../../../common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { NAME_ERROR_MESSAGE, NAME_REGEX, UsersValidationRules } from '../../../common/src/resources/users';
import { IsDateInPast } from '../../../common/src/resources/common/is-date-in-past.decorator';
import { DateAge } from '../../../common/src/resources/common/date-age.decorator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateUserAdditionalFieldDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MinLength(UsersValidationRules.firstNameMinLength)
    @MaxLength(UsersValidationRules.firstNameMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(NAME_REGEX, { message: `firstName ${NAME_ERROR_MESSAGE}` })
    readonly firstName: string;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MinLength(UsersValidationRules.lastNameMinLength)
    @MaxLength(UsersValidationRules.lastNameMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(NAME_REGEX, { message: `lastName ${NAME_ERROR_MESSAGE}` })
    readonly lastName: string;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(SexTypes) })
    @IsNumber()
    @IsEnum(SexTypes)
    @IsNotEmpty()
    readonly sex: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsDateInPast()
    @DateAge(UsersValidationRules.ageMinValue)
    readonly dateOfBirth: string;
}
