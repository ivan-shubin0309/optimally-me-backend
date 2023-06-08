import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { AddRecommendationDto } from '../recommendations/add-recommendation.dto';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { MaxFieldValueRepeatCount } from '../../../../common/src/resources/common/max-field-value-repeat-count.decorator';
import { FilterValidationRules } from '../../../../common/src/resources/filters/validation-rules';
import { NumberMaxCharacters } from '../../../../common/src/resources/common/number-max-characters';
import { CheckAllowedRecommendationTypes } from '../../../../common/src/resources/filters/check-allowed-recommendation-types.decorator';
import { CreateFilterSummaryDto } from '../filterSummaries/create-filter-summary.dto';
import { CheckAllowedSummaries } from '../../../../common/src/resources/filterSummaries/check-allowed-summaries.decorator';
import { CheckIsAllowedTextField } from '../../../../common/src/resources/filters/check-allowed-risks.decorator';
import { CreateWhatAreTheCausesDto } from './create-what-are-the-causes.dto';
import { ICreateFilter } from '../create-biomarker.interface';

export class CreateDnaAgeFilterDto implements ICreateFilter {
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
}