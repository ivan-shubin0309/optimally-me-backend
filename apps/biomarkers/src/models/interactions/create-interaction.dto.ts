import { ApiProperty } from '@nestjs/swagger';
import { InteractionTypes } from '../../../../common/src/resources/interactions/interaction-types';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, Length, Max, Min } from 'class-validator';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { InteractionValidationRules } from '../../../../common/src/resources/interactions/validation-rules';

export class CreateInteractionDto {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(InteractionTypes) })
    @IsNotEmpty()
    @IsEnum(InteractionTypes)
    @IsNumber()
    type: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @Length(InteractionValidationRules.nameMinLength, InteractionValidationRules.nameMaxLength)
    name: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(InteractionValidationRules.impactMin)
    @Max(InteractionValidationRules.impactMax)
    impact: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    effects: string;
}