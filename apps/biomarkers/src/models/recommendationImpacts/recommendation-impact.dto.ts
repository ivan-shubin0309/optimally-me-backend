import { ApiProperty } from '@nestjs/swagger';
import { ImpactStudyLinkTypes } from '../../../../common/src/resources/recommendation-impacts/impact-study-link-types';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationImpact } from './recommendation-impact.entity';
import { ImpactStudyLinkDto } from './impact-study-link.dto';


export class RecommendationImpactDto extends BaseDto<RecommendationImpact>{
    constructor(entity: RecommendationImpact) {
        super(entity);

        this.recommendationId = entity.recommendationId;
        this.biomarkerId = entity.biomarkerId;
        this.descriptionHigh = entity.descriptionHigh;
        this.impactLevelHigh = entity.impactLevelHigh;
        this.qualityOfEvidenceHigh = entity.qualityOfEvidenceHigh;
        this.strengthOfEvidenceHigh = entity.strengthOfEvidenceHigh;
        this.descriptionLow = entity.descriptionLow;
        this.impactLevelLow = entity.impactLevelLow;
        this.qualityOfEvidenceLow = entity.qualityOfEvidenceLow;
        this.strengthOfEvidenceLow = entity.strengthOfEvidenceLow;
        this.biomarkerName = entity.biomarker && entity.biomarker.name;
        this.lowStudyLinks = entity.studyLinks
            ? entity.studyLinks
                .filter(link => link.type === ImpactStudyLinkTypes.low)
                .map(link => new ImpactStudyLinkDto(link))
            : undefined;
        this.highStudyLinks = entity.studyLinks
            ? entity.studyLinks
                .filter(link => link.type === ImpactStudyLinkTypes.high)
                .map(link => new ImpactStudyLinkDto(link))
            : undefined;
    }

    @ApiProperty({ type: () => Number, required: true })
    recommendationId: number;

    @ApiProperty({ type: () => Number, required: false })
    biomarkerId: number;

    @ApiProperty({ type: () => String, required: false })
    descriptionHigh: string;

    @ApiProperty({ type: () => Number, required: true })
    impactLevelHigh: number;

    @ApiProperty({ type: () => Number, required: true })
    qualityOfEvidenceHigh: number;

    @ApiProperty({ type: () => Number, required: true })
    strengthOfEvidenceHigh: number;

    @ApiProperty({ type: () => String, required: false })
    descriptionLow: string;

    @ApiProperty({ type: () => Number, required: true })
    impactLevelLow: number;

    @ApiProperty({ type: () => Number, required: true })
    qualityOfEvidenceLow: number;

    @ApiProperty({ type: () => Number, required: true })
    strengthOfEvidenceLow: number;

    @ApiProperty({ type: () => String, required: false })
    biomarkerName: string;

    @ApiProperty({ type: () => [ImpactStudyLinkDto], required: false })
    lowStudyLinks: ImpactStudyLinkDto[];

    @ApiProperty({ type: () => [ImpactStudyLinkDto], required: false })
    highStudyLinks: ImpactStudyLinkDto[];
}