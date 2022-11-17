import { ApiProperty } from '@nestjs/swagger';
import { AgeTypes } from '../../../../common/src/resources/filters/age-types';
import { EthnicityTypes } from '../../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../../common/src/resources/filters/other-feature-types';
import { SexTypes } from '../../../../common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { CreateInteractionDto } from '../interactions/create-interaction.dto';
import { AddRecommendationDto } from '../recommendations/add-recommendation.dto';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { MaxFieldValueRepeatCount } from '../../../../common/src/resources/common/max-field-value-repeat-count.decorator';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { NumberMaxCharacters } from '../../../../common/src/resources/common/number-max-characters';
import { CheckAllowedRecommendationTypes } from '../../../../common/src/resources/filters/check-allowed-recommendation-types.decorator';
import { CreateFilterGroupDto } from '../filterGroups/create-filter-group.dto';
import { ArrayDistinct } from '../../../../common/src/resources/common/array-distinct.decorator';
import { CreateFilterSummaryDto } from '../filterSummaries/create-filter-summary.dto';
import { CheckAllowedSummaries } from '../../../../common/src/resources/filterSummaries/check-allowed-summaries.decorator';
import { CreateWhatAreTheRisksDto } from './create-what-are-the-risks.dto';
import { CheckIsAllowedTextField } from '../../../../common/src/resources/filters/check-allowed-risks.decorator';
import { CreateWhatAreTheCausesDto } from './create-what-are-the-causes.dto';

export class CreateFilterDto {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly name: string;

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
    readonly whatIsIt: string;

    @ApiProperty({ type: () => CreateWhatAreTheCausesDto, required: false })
    @IsOptional()
    @CheckIsAllowedTextField()
    @ValidateNested()
    @Type(() => CreateWhatAreTheCausesDto)
    readonly whatAreTheCauses: CreateWhatAreTheCausesDto;

    @ApiProperty({ type: () => CreateWhatAreTheRisksDto, required: false })
    @IsOptional()
    @CheckIsAllowedTextField()
    @ValidateNested()
    @Type(() => CreateWhatAreTheRisksDto)
    readonly whatAreTheRisks: CreateWhatAreTheRisksDto;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly whatCanYouDo: string;

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
    readonly optimalMin: number = null;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly optimalMax: number = null;

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
    @IsOptional()
    @IsNumber()
    @Min(FilterValidationRules.rangeMinValue)
    @NumberMaxCharacters(FilterValidationRules.rangeMaxCharactersCount)
    readonly criticalHigh: number = null;

    @ApiProperty({ type: () => [AddRecommendationDto], required: false })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(FilterValidationRules.recommendationArrayMaxLength)
    @MaxFieldValueRepeatCount('type', FilterValidationRules.recommendationTypesMaxCount)
    @CheckAllowedRecommendationTypes({ each: true })
    @ValidateNested()
    @Type(() => AddRecommendationDto)
    readonly recommendations: AddRecommendationDto[];

    @ApiProperty({ type: () => [CreateInteractionDto], required: false })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(FilterValidationRules.interactionArrayMaxLength)
    @MaxFieldValueRepeatCount('type', FilterValidationRules.interactionTypesMaxCount)
    @ValidateNested()
    @Type(() => CreateInteractionDto)
    readonly interactions: CreateInteractionDto[];

    @ApiProperty({ type: () => [Number], required: true, description: EnumHelper.toDescription(AgeTypes) })
    @ArrayMinSize(1)
    @IsEnum(AgeTypes, { each: true })
    readonly ages: number[];

    @ApiProperty({ type: () => [Number], required: true, description: EnumHelper.toDescription(SexTypes) })
    @ArrayMinSize(1)
    @IsEnum(SexTypes, { each: true })
    readonly sexes: number[];

    @ApiProperty({ type: () => [Number], required: true, description: EnumHelper.toDescription(EthnicityTypes) })
    @ArrayMinSize(1)
    @IsEnum(EthnicityTypes, { each: true })
    readonly ethnicities: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(OtherFeatureTypes) })
    @IsOptional()
    @IsArray()
    @IsEnum(OtherFeatureTypes, { each: true })
    readonly otherFeatures: number[];

    @ApiProperty({ type: () => [CreateFilterGroupDto], required: false })
    @IsArray()
    @IsOptional()
    @ArrayDistinct('type')
    @ValidateNested()
    @Type(() => CreateFilterGroupDto)
    readonly groups: CreateFilterGroupDto[];
}