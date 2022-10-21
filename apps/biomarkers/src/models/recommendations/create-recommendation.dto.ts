import { ApiProperty } from '@nestjs/swagger';
import { RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateNested } from 'class-validator';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { CreateRecommendationImpactDto } from '../recommendationImpacts/create-recommendation-impact.dto';
import { Type } from 'class-transformer';
import { ArrayDistinct } from '../../../../common/src/resources/common/array-distinct.decorator';

export class CreateRecommendationDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationCategoryTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(RecommendationCategoryTypes)
    readonly category: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    readonly title: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationActionTypes) })
    @IsOptional()
    @IsEnum(RecommendationActionTypes)
    @IsNumber()
    readonly type: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly content: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly productLink: string;

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
    @ValidateNested()
    @Type(() => CreateRecommendationImpactDto)
    readonly impacts: CreateRecommendationImpactDto[];
}