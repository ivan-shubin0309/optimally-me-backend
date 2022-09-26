import { IsNotEmpty, MaxLength, MinLength, IsArray, ArrayMaxSize, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRuleDto } from './rules/create-rule.dto';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { UnitTypes } from '../services/units/units-types';
import { CategoryTypes } from '../services/category/category-types';
import { ALTERNATIVE_NAMES_LIMIT_ERROR_MESSAGE, BIOMARKER_NAME_ERROR_MESSAGE } from '../../../common/src/resources/users';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateBiomarkerDto {
    @ApiProperty({ type: () => String, required: true })
    @MaxLength(200)
    @MinLength(1, { message: BIOMARKER_NAME_ERROR_MESSAGE })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => Array<string>, required: false })
    @ArrayMaxSize(10, { message: ALTERNATIVE_NAMES_LIMIT_ERROR_MESSAGE })
    @IsArray()
    readonly alternativeNames: string[];

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(CategoryTypes) })
    @IsNotEmpty()
    @IsEnum(CategoryTypes)
    readonly category: number;

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(UnitTypes) })
    @IsNotEmpty()
    @IsEnum(UnitTypes)
    readonly unit: number;

    @ApiProperty({ type: () => CreateRuleDto, required: true })
    @IsNotEmpty()
    readonly rule: CreateRuleDto;
}