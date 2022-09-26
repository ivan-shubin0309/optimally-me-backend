import { IsNotEmpty, MaxLength, MinLength, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { InteractionTypes } from '../../services/interactions/interaction-types';

export class CreateInteractionDto {

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(InteractionTypes) })
    @IsNotEmpty()
    @IsEnum(InteractionTypes)
    readonly type: number;

    @ApiProperty({ type: () => String, required: true })
    @MaxLength(100)
    @MinLength(1)
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    @MaxLength(100)
    readonly alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: false })
    @IsNumber()
    readonly impact: number;

    @ApiProperty({ type: () => String, required: false })
    readonly effects: string;
}