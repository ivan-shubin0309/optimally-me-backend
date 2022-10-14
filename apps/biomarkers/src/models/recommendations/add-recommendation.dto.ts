import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';

export class AddRecommendationDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsPositive()
    @IsInt()
    readonly order: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsPositive()
    @IsInt()
    readonly recommendationId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationTypes) })
    @IsNotEmpty()
    @IsEnum(RecommendationTypes)
    @IsNumber()
    readonly type: number;
}