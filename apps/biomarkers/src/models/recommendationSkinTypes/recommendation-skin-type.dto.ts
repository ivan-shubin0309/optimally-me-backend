import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { RecommendationSkinType } from './recommendation-skin-type.entity';
import { RecommendationSkinTypes } from '../../../../common/src/resources/recommendations/skin-types';

export class RecommendationSkinTypeDto extends BaseDto<RecommendationSkinType> {
    constructor(entity: RecommendationSkinType) {
        super(entity);
        this.recommendationId = entity.recommendationId;
        this.skinType = entity.skinType;
        this.isIdealSkinType = entity.isIdealSkinType;
    }

    @ApiProperty({ type: () => Number, required: true })
    recommendationId: number;

    @ApiProperty({ type: () => Number, required: true, description: EnumHelper.toDescription(RecommendationSkinTypes) })
    skinType: number;

    @ApiProperty({ type: () => Boolean, required: true })
    isIdealSkinType: boolean;
}