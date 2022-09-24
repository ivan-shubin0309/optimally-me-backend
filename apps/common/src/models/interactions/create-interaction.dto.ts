import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { InteractionTypes } from '../../resources/interactions/interaction-types';

export class CreateInteractionDto {

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(InteractionTypes) })
    @IsNotEmpty()
    readonly type: number;

    @ApiProperty({ type: () => String, required: true })
    @MaxLength(1)
    @MinLength(100)
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ type: () => String, required: false })
    @MinLength(100)
    readonly alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly impact: number;

    @ApiProperty({ type: () => String, required: false })
    readonly effects: string;
}