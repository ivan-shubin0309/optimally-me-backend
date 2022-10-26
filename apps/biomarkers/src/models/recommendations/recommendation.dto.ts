import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { Recommendation } from './recommendation.entity';
import { FileDto } from '../../../../files/src/models/file.dto';
import { RecommendationImpactDto } from '../recommendationImpacts/recommendation-impact.dto';


export class RecommendationDto extends BaseDto<Recommendation> {
    constructor(entity: Recommendation) {
        super(entity);
        this.category = entity.category;
        this.content = entity.content;
        this.title = entity.title;
        this.type = entity.type;
        this.productLink = entity.productLink;
        this.isArchived = entity.isArchived;
        this.file = entity.files && entity.files.length
            ? new FileDto(entity.files[0])
            : undefined;
        this.impacts = entity.impacts && entity.impacts.length
            ? entity.impacts.map(impact => new RecommendationImpactDto(impact))
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

    @ApiProperty({ type: () => [RecommendationImpactDto], required: false })
    readonly impacts: RecommendationImpactDto[];
}