import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { Recommendation } from './recommendation.entity';
import { FileDto } from '../../../../files/src/models/file.dto';
import { RecommendationImpactDto } from '../recommendationImpacts/recommendation-impact.dto';
import { RecommendationReactionTypes } from '../../../../common/src/resources/recommendation-reactions/reaction-types';
import { RecommendationSkinTypeDto } from '../recommendationSkinTypes/recommendation-skin-type.dto';
import { RecommendationContradictionDto } from '../recommendationContradictions/recommendation-contradiction.dto';
import { IdealTimeOfDayTypes } from '../../../../common/src/resources/recommendations/ideal-time-of-day-types';


export class RecommendationDto extends BaseDto<Recommendation> {
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
        this.file = entity.files && entity.files.length
            ? new FileDto(entity.files[0])
            : undefined;
        this.impacts = entity.impacts && entity.impacts.length
            ? entity.impacts.map(impact => new RecommendationImpactDto(impact))
            : undefined;
        this.userReactionType = entity.userReaction
            ? entity.userReaction.reactionType
            : undefined;
        this.idealSkinTypes = entity.skinTypes && entity.skinTypes.length
            ? entity.skinTypes
                .filter(skinType => skinType.isIdealSkinType)
                .map(skinType => new RecommendationSkinTypeDto(skinType))
            : undefined;
        this.notMeantForSkinTypes = entity.skinTypes && entity.skinTypes.length
            ? entity.skinTypes
                .filter(skinType => !skinType.isIdealSkinType)
                .map(skinType => new RecommendationSkinTypeDto(skinType))
            : undefined;
        this.contradictions = entity.contradictions && entity.contradictions.length
            ? entity.contradictions.map(contradiction => new RecommendationContradictionDto(contradiction))
            : undefined;
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

    @ApiProperty({ type: () => FileDto, required: false })
    readonly file: FileDto;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isArchived: boolean;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly isAddToCartAllowed: boolean;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(IdealTimeOfDayTypes) })
    readonly idealTimeOfDay: number;

    @ApiProperty({ type: () => [RecommendationImpactDto], required: false })
    readonly impacts: RecommendationImpactDto[];

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationReactionTypes) })
    readonly userReactionType: number;

    @ApiProperty({ type: () => [RecommendationSkinTypeDto], required: false })
    readonly idealSkinTypes: RecommendationSkinTypeDto[];

    @ApiProperty({ type: () => [RecommendationSkinTypeDto], required: false })
    readonly notMeantForSkinTypes: RecommendationSkinTypeDto[];

    @ApiProperty({ type: () => [RecommendationContradictionDto], required: false })
    readonly contradictions: RecommendationContradictionDto[];
}