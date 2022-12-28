import { IsNotEmpty, MaxLength, MinLength, IsArray, ArrayMaxSize, IsPositive, IsInt, IsString, ValidateNested, IsOptional, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { biomarkerValidationRules } from '../../../common/src/resources/biomarkers/validation-rules';
import { UpdateBloodFilterDto } from './filters/update-blood-filter.dto';
import { ICreateBiomarker } from './create-biomarker.interface';

export class UpdateBloodBiomarkerDto implements ICreateBiomarker {
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

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    readonly unitId: number;

    @ApiProperty({ type: () => [UpdateBloodFilterDto], required: true })
    @ArrayNotEmpty()
    @ArrayMaxSize(biomarkerValidationRules.filtersMaxCount)
    @ValidateNested()
    @Type(() => UpdateBloodFilterDto)
    readonly filters: UpdateBloodFilterDto[];
}