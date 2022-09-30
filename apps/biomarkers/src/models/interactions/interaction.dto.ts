import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { Interaction } from './interaction.entity';

export class InteractionDto extends BaseDto<Interaction> {
    constructor(entity: Interaction) {
        super(entity);
        this.name = entity.name;
        this.type = entity.type;
        this.filterId = entity.filterId;
        this.alsoKnowAs = entity.alsoKnowAs;
        this.impact = entity.impact;
        this.effects = entity.effects;
    }

    @ApiProperty({ type: () => String, required: false })
    readonly name: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly type: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly filterId: number;

    @ApiProperty({ type: () => String, required: false })
    readonly alsoKnowAs: string;

    @ApiProperty({ type: () => Number, required: false })
    readonly impact: number;

    @ApiProperty({ type: () => String, required: false })
    readonly effects: string;
}