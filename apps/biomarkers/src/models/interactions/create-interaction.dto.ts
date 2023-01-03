import { ApiProperty } from '@nestjs/swagger';
import { InteractionTypes } from '../../../../common/src/resources/interactions/interaction-types';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, Length, Max, Min } from 'class-validator';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { InteractionValidationRules } from '../../../../common/src/resources/interactions/validation-rules';
import { ICreateInteraction } from '../create-biomarker.interface';

export class CreateInteractionDto implements ICreateInteraction {
    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(InteractionTypes) })
    @IsNotEmpty()
    @IsEnum(InteractionTypes)
    @IsNumber()
    readonly type: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @Length(InteractionValidationRules.nameMinLength, InteractionValidationRules.nameMaxLength)
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(InteractionValidationRules.impactMin)
    @Max(InteractionValidationRules.impactMax)
    readonly impact: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    readonly effects: string;
}