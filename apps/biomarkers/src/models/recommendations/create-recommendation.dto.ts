import { ApiProperty } from '@nestjs/swagger';
import { RecommendationCategoryTypes } from 'apps/common/src/resources/recommendations/recommendation-category-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
    readonly title: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationActionTypes) })
    @IsOptional()
    @IsEnum(RecommendationActionTypes)
    @IsNumber()
    readonly type: number;

    @ApiProperty({ type: () => String, required: true })
    @IsOptional()
    @IsString()
    readonly content: number;
}