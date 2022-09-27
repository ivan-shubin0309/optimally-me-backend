import { ApiProperty } from '@nestjs/swagger';
import { LibraryInteraction } from './library-interaction.entity';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { InteractionTypes } from '../../services/interactions/interaction-types';


export class LibraryInteractionDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly ruleId: number;

    @ApiProperty({ type: () => Number, description: EnumHelper.toDescription(InteractionTypes) })
    readonly type: number;

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => String, required: true })
    readonly alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly impact: number;

    @ApiProperty({ type: () => String, required: true })
    readonly effects: string;

    constructor(entity: LibraryInteraction) {
        this.id = entity.id;
        this.ruleId = entity.ruleId;
        this.type = entity.type;
        this.name = entity.name;
        this.alsoKnowAs = entity.alsoKnowAs;
        this.impact = entity.impact;
        this.effects = entity.effects;
    }
}