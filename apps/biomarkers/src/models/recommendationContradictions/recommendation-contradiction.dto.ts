import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { RecommendationContradiction } from './recommendation-contradiction.entity';
import { RecommendationContradictionTypes } from '../../../../common/src/resources/recommendations/contradiction-types';

export class RecommendationContradictionDto extends BaseDto<RecommendationContradiction> {
    constructor(entity: RecommendationContradiction) {
        super(entity);
        this.recommendationId = entity.recommendationId;
        this.contradictionType = entity.contradictionType;
    }

    @ApiProperty({ type: () => Number, required: true })
    recommendationId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationContradictionTypes) })
    contradictionType: number;
}