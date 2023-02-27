import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { Recommendation } from './recommendation.entity';
import { IdealTimeOfDayTypes } from '../../../../common/src/resources/recommendations/ideal-time-of-day-types';


export class BaseRecommendationDto extends BaseDto<Recommendation> {
    constructor(entity: Recommendation) {
        super(entity);
        this.category = entity.category;
        this.content = entity.content;
        this.title = entity.title;
        this.type = entity.type;
        this.productLink = entity.productLink;
        this.isArchived = entity.isArchived;
        this.isAddToCartAllowed = entity.isAddToCartAllowed;
        this.idealTimeOfDay = entity.idealTimeOfDay;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly category: number;

    @ApiProperty({ type: () => String, required: true })
    readonly content: string;

    @ApiProperty({ type: () => String, required: false })
    readonly title: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationActionTypes) })
    readonly type: number;

    @ApiProperty({ type: () => String, required: false })
    readonly productLink: string;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isArchived: boolean;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isAddToCartAllowed: boolean;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(IdealTimeOfDayTypes) })
    readonly idealTimeOfDay: number;
}