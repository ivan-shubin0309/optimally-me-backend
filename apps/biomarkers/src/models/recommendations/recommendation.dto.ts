import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationActionTypes } from 'apps/common/src/resources/recommendations/recommendation-action-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { Recommendation } from './recommendation.entity';


export class RecommendationDto extends BaseDto<Recommendation> {
    constructor(entity: Recommendation) {
        super(entity);
        this.category = entity.category;
        this.content = entity.content;
        this.title = entity.title;
        this.type = entity.type;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly category: number;

    @ApiProperty({ type: () => String, required: true })
    readonly content: string;

    @ApiProperty({ type: () => String, required: false })
    readonly title: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationActionTypes) })
    readonly type: number;
}