import { ApiProperty } from '@nestjs/swagger';
import { InteractionTypes } from '../../../../common/src/resources/interactions/interaction-types';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
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
    impact: number;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    effects: string;
}