import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { AddRecommendationDto } from '../recommendations/add-recommendation.dto';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { NumberMaxCharacters } from '../../../../common/src/resources/common/number-max-characters';
import { CreateFilterSummaryDto } from '../filterSummaries/create-filter-summary.dto';
import { CheckAllowedSummaries } from '../../../../common/src/resources/filterSummaries/check-allowed-summaries.decorator';
import { CheckIsAllowedTextField } from '../../../../common/src/resources/filters/check-allowed-risks.decorator';
import { CreateWhatAreTheCausesDto } from './create-what-are-the-causes.dto';
import { ICreateFilter } from '../create-biomarker.interface';
import { skinBiomarkerValidationRules } from '../../../../common/src/resources/biomarkers/validation-rules';
import { SkinTypes } from '../../../../common/src/resources/filters/skin-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { ValidateIdealSkinType } from '../../../../common/src/resources/filters/validate-ideal-skin-types.decorator';
import { ContradictionTypes } from '../../../../common/src/resources/filters/contradiction-types';

export class CreateSkinFilterDto implements ICreateFilter {
    @ApiProperty({ type: () => String, required: false })
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @MaxLength(FilterValidationRules.summaryMaxLength)
    readonly summary: string;

    @ApiProperty({ type: () => CreateFilterSummaryDto, required: false })
    @IsOptional()
    @CheckAllowedSummaries()
    @ValidateNested()
    @Type(() => CreateFilterSummaryDto)
    readonly resultSummary: CreateFilterSummaryDto;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsString()
    @MaxLength(FilterValidationRules.whatIsItMaxLength)
    readonly whatIsIt: string;

    @ApiProperty({ type: () => CreateWhatAreTheCausesDto, required: false })
    @IsOptional()
    @CheckIsAllowedTextField()
    @ValidateNested()
    @Type(() => CreateWhatAreTheCausesDto)
    readonly whatAreTheCauses: CreateWhatAreTheCausesDto;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly criticalLow: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly lowMin: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly lowMax: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly subOptimalMin: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly subOptimalMax: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly supraOptimalMin: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly supraOptimalMax: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly highMin: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly highMax: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly criticalHigh: number = null;

    @ApiProperty({ type: () => [AddRecommendationDto], required: false })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(skinBiomarkerValidationRules.maxRecommendations)
    @ValidateNested()
    @Type(() => AddRecommendationDto)
    readonly recommendations: AddRecommendationDto[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(SkinTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(SkinTypes, { each: true })
    @ValidateIdealSkinType()
    readonly idealSkinTypes: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(SkinTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(SkinTypes, { each: true })
    readonly notMeantForSkinTypes: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(ContradictionTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(ContradictionTypes, { each: true })
    readonly contradictions: number[];
}