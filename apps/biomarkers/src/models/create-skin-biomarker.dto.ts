import { ICreateBiomarker } from './create-biomarker.interface';
import { IsNotEmpty, MaxLength, MinLength, ArrayMaxSize, IsPositive, IsInt, ValidateNested, IsOptional, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { biomarkerValidationRules, skinBiomarkerValidationRules } from '../../../common/src/resources/biomarkers/validation-rules';
import { CreateSkinFilterDto } from './filters/create-skin-filter.dto';

export class CreateSkinBiomarkerDto implements ICreateBiomarker {
    @ApiProperty({ type: () => String, required: true })
    @MaxLength(biomarkerValidationRules.nameMaxLength)
    @MinLength(biomarkerValidationRules.nameMinLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => String, required: true })
    @MaxLength(biomarkerValidationRules.labelMaxLength)
    @MinLength(biomarkerValidationRules.labelMinLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    readonly label: string;

    @ApiProperty({ type: () => String, required: true })
    @MaxLength(biomarkerValidationRules.shortNameMaxLength)
    @MinLength(biomarkerValidationRules.shortNameMinLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    readonly shortName: string;

    @ApiProperty({ type: () => String, required: false })
    @MaxLength(biomarkerValidationRules.nameMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    readonly ruleName: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsInt()
    @IsPositive()
    @IsOptional()
    readonly ruleId: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly categoryId: number;

    @ApiProperty({ type: () => [CreateSkinFilterDto], required: true })
    @ArrayNotEmpty()
    @ArrayMaxSize(skinBiomarkerValidationRules.filtersMaxCount)
    @ValidateNested()
    @Type(() => CreateSkinFilterDto)
    readonly filters: CreateSkinFilterDto[];
}