import { ApiProperty } from '@nestjs/swagger';
import { RecommendationReactionTypes } from '../../../../common/src/resources/recommendation-reactions/reaction-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationReaction } from './recommendation-reaction.entity';

export class RecommendationReactionDto extends BaseDto<RecommendationReaction> {
    constructor(entity: RecommendationReaction) {
        super(entity);
        this.userId = entity.userId;
        this.recommendationId = entity.recommendationId;
        this.reactionType = entity.reactionType;
        this.description = entity.description;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly recommendationId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationReactionTypes) })
    readonly reactionType: number;

    @ApiProperty({ type: () => String, required: false })
    readonly description: string;
}