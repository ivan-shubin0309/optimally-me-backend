import { ApiProperty } from '@nestjs/swagger';
import { recommendationReactionValidationRules } from '../../../common/src/resources/recommendation-reactions/validation-rules';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { RecommendationReactionTypes } from '../../../common/src/resources/recommendation-reactions/reaction-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { DescriptionRequired } from '../../../common/src/resources/recommendation-reactions/description-required.decorator';
import { Transform, TransformFnParams } from 'class-transformer';

export class PutReactRecommendationDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    readonly userResultId: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    readonly recommendationId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationReactionTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(RecommendationReactionTypes)
    @DescriptionRequired()
    readonly reactionType: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @MinLength(recommendationReactionValidationRules.descriptionMinLength)
    @MaxLength(recommendationReactionValidationRules.descriptionMaxLength)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    readonly description: string;
}