import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { Recommendation } from './recommendation.entity';
import { FileDto } from '../../../../files/src/models/file.dto';
import { RecommendationImpactDto } from '../recommendationImpacts/recommendation-impact.dto';
import { RecommendationReactionTypes } from '../../../../common/src/resources/recommendation-reactions/reaction-types';
import { RecommendationSkinTypeDto } from '../recommendationSkinTypes/recommendation-skin-type.dto';
import { RecommendationContradictionDto } from '../recommendationContradictions/recommendation-contradiction.dto';
import { BaseRecommendationDto } from './base-recommendation.dto';


export class RecommendationDto extends BaseRecommendationDto {
    constructor(entity: Recommendation) {
        super(entity);
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
        this.tagName = entity.tag 
            ? entity.tag.name
            : undefined;
    }

    @ApiProperty({ type: () => FileDto, required: false })
    readonly file: FileDto;

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

    @ApiProperty({ type: () => String, required: false })
    readonly tagName: string;
}