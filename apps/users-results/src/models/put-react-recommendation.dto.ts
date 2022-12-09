import { ApiProperty } from '@nestjs/swagger';
import { recommendationReactionValidationRules } from '../../../common/src/resources/recommendation-reactions/validation-rules';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { RecommendationReactionTypes } from '../../../common/src/resources/recommendation-reactions/reaction-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';

export class PutReactRecommendationDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationReactionTypes) })
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(RecommendationReactionTypes)
    readonly reactionType: number;

    @ApiProperty({ type: () => String, required: false })
    @ValidateIf((obj) => obj.reactionType === RecommendationReactionTypes.dislike)
    @IsNotEmpty()
    @IsString()
    @MinLength(recommendationReactionValidationRules.descriptionMinLength)
    @MaxLength(recommendationReactionValidationRules.descriptionMaxLength)
    readonly description: string;
}