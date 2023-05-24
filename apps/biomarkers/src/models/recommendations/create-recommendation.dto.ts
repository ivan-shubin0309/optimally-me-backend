import { ApiProperty } from '@nestjs/swagger';
import { RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { CreateRecommendationImpactDto } from '../recommendationImpacts/create-recommendation-impact.dto';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ArrayDistinct } from '../../../../common/src/resources/common/array-distinct.decorator';
import { recommendationValidationRules } from '../../../../common/src/resources/recommendations/recommendation-validation-rules';
import { OneOf } from '../../../../common/src/resources/common/one-of.decorator';
import { RecommendationSkinTypes } from '../../../../common/src/resources/recommendations/skin-types';
import { RecommendationContradictionTypes } from '../../../../common/src/resources/recommendations/contradiction-types';
import { ValidateIdealSkinType } from '../../../../common/src/resources/recommendations/validate-ideal-skin-type';
import { IdealTimeOfDayTypes } from '../../../../common/src/resources/recommendations/ideal-time-of-day-types';
import { IsAddToCartAllowed } from '../../../../common/src/resources/recommendations/is-add-to-cart-allowed.decorator';
import { RecommendationCategoryValidation } from '../../../../common/src/resources/recommendations/recommendation-category-validation.decorator';
import { IdealFrequencyTypes } from '../../../../common/src/resources/recommendations/ideal-frequency-types';

export class CreateRecommendationDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationCategoryTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(RecommendationCategoryTypes)
    @RecommendationCategoryValidation()
    readonly category: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MinLength(recommendationValidationRules.titleMinLength)
    @MaxLength(recommendationValidationRules.titleMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly title: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationActionTypes) })
    @IsOptional()
    @IsEnum(RecommendationActionTypes)
    @IsNumber()
    readonly type: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(recommendationValidationRules.contentMaxLength)
    readonly content: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(recommendationValidationRules.productLinkMaxLength)
    @MinLength(recommendationValidationRules.productLinkMinLength)
    readonly productLink: string;

    @ApiProperty({ type: () => Boolean, required: false, default: true })
    @IsOptional()
    @IsBoolean()
    @IsAddToCartAllowed()
    readonly isAddToCartAllowed: boolean;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(IdealTimeOfDayTypes) })
    @IsOptional()
    @IsEnum(IdealTimeOfDayTypes)
    @IsNumber()
    readonly idealTimeOfDay: number;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(IdealFrequencyTypes) })
    @IsOptional()
    @IsEnum(IdealFrequencyTypes)
    @IsNumber()
    readonly idealFrequency: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    readonly fileId: number;

    @ApiProperty({ type: () => [CreateRecommendationImpactDto], required: false })
    @IsOptional()
    @IsArray()
    @ArrayDistinct('biomarkerId')
    @OneOf(['descriptionLow', 'descriptionHigh'], { each: true })
    @ValidateNested()
    @Type(() => CreateRecommendationImpactDto)
    readonly impacts: CreateRecommendationImpactDto[];


    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(RecommendationSkinTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(RecommendationSkinTypes, { each: true })
    @ValidateIdealSkinType()
    readonly idealSkinTypes: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(RecommendationSkinTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(RecommendationSkinTypes, { each: true })
    readonly notMeantForSkinTypes: number[];

    @ApiProperty({ type: () => [Number], required: false, description: EnumHelper.toDescription(RecommendationContradictionTypes) })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsNumber({}, { each: true })
    @IsEnum(RecommendationContradictionTypes, { each: true })
    readonly contradictions: number[];

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(recommendationValidationRules.tagNameMaxLength)
    @MinLength(recommendationValidationRules.tagNameMinLength)    
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly tagName: string;
}