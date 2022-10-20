import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/src/base/base.dto';
import { RecommendationImpact } from './recommendation-impact.entity';


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
}