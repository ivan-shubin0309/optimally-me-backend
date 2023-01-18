import { IsNotEmpty, MaxLength, MinLength, ArrayMaxSize, IsPositive, IsInt, ValidateNested, IsOptional, ArrayNotEmpty, IsArray, IsString, ArrayUnique, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { biomarkerValidationRules, skinBiomarkerValidationRules } from '../../../common/src/resources/biomarkers/validation-rules';
import { ICreateBiomarker } from './create-biomarker.interface';
import { UpdateSkinFilterDto } from './filters/update-skin-filter.dto';
import { HautAiMetricTypes } from '../../../common/src/resources/haut-ai/haut-ai-metric-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';

export class UpdateSkinBiomarkerDto implements ICreateBiomarker {
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

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(HautAiMetricTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(HautAiMetricTypes)
    readonly hautAiMetricType: number;

    @ApiProperty({ type: () => [UpdateSkinFilterDto], required: true })
    @ArrayNotEmpty()
    @ArrayMaxSize(skinBiomarkerValidationRules.filtersMaxCount)
    @ValidateNested()
    @Type(() => UpdateSkinFilterDto)
    readonly filters: UpdateSkinFilterDto[];
}