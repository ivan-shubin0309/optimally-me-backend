import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { FileDto } from '../../../files/src/models/file.dto';
import { RecommendationReactionTypes } from '../../../common/src/resources/recommendation-reactions/reaction-types';
import { UserBiomarkerDto } from '../../../users-biomarkers/src/models/user-biomarker.dto';
import { Recommendation } from '../../../biomarkers/src/models/recommendations/recommendation.entity';
import { BaseRecommendationDto } from '../../../biomarkers/src/models/recommendations/base-recommendation.dto';
import { BaseUserRecommendationDto } from '../../../biomarkers/src/models/userRecommendations/base-user-recommendation.dto';


export class RecommendationForUserListDto extends BaseRecommendationDto {
    constructor(entity: Recommendation) {
        super(entity);
        this.file = entity.files && entity.files.length
            ? new FileDto(entity.files[0])
            : undefined;
        this.userReactionType = entity.userReaction
            ? entity.userReaction.reactionType
            : undefined;
        this.userBiomarkers = entity.get('biomarkers') && entity.get('biomarkers').length
            ? entity.get('biomarkers').map(biomarker => new UserBiomarkerDto(biomarker))
            : undefined;
        this.userRecommendation = entity.userRecommendation
            ? new BaseUserRecommendationDto(entity.userRecommendation)
            : undefined;
    }

    @ApiProperty({ type: () => FileDto, required: false })
    readonly file: FileDto;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationReactionTypes) })
    readonly userReactionType: number;

    @ApiProperty({ type: () => [UserBiomarkerDto], required: false })
    readonly userBiomarkers: UserBiomarkerDto[];

    @ApiProperty({ type: () => BaseUserRecommendationDto, required: false })
    readonly userRecommendation: BaseUserRecommendationDto;
}