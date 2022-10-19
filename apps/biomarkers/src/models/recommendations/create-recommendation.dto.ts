import { ApiProperty } from '@nestjs/swagger';
import { RecommendationCategoryTypes } from 'apps/common/src/resources/recommendations/recommendation-category-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';

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
    readonly productLink: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    readonly fileId: number;
}