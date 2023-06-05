import { ICreateBiomarker } from './create-biomarker.interface';
import { IsNotEmpty, MaxLength, MinLength, ArrayMaxSize, IsPositive, IsInt, ValidateNested, IsOptional, ArrayNotEmpty, IsArray, IsString, ArrayUnique } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { biomarkerValidationRules, skinBiomarkerValidationRules } from '../../../common/src/resources/biomarkers/validation-rules';
import { CreateDnaAgeFilterDto } from './filters/create-dna-age-filter.dto';

export class CreateDnaAgeBiomarkerDto implements ICreateBiomarker {
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

    @ApiProperty({ type: () => [String], required: false })
    @IsOptional()
    @ArrayMaxSize(biomarkerValidationRules.alternativeNamesMax)
    @IsArray()
    @IsString({ each: true })
    @ArrayUnique()
    readonly alternativeNames: string[];

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

    @ApiProperty({ type: () => [CreateDnaAgeFilterDto], required: true })
    @ArrayNotEmpty()
    @ArrayMaxSize(skinBiomarkerValidationRules.filtersMaxCount)
    @ValidateNested()
    @Type(() => CreateDnaAgeFilterDto)
    readonly filters: CreateDnaAgeFilterDto[];
}