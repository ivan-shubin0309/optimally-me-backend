import { ApiProperty } from '@nestjs/swagger';
import { RecommendationTypes } from '../../../common/src/resources/recommendations/recommendation-types';
import { EnumHelper } from '../../../common/src/utils/helpers/enum.helper';
import { UnitDto } from '../../../biomarkers/src/models/units/unit.dto';
import { BaseDto } from '../../../common/src/base/base.dto';
import { UserResultBiomarkerDto } from './user-result-biomarker.dto';
import { UserResult } from './user-result.entity';

export class UserResultDto extends BaseDto<UserResult> {
    constructor(data: UserResult) {
        super(data);
        this.biomarkerId = data.biomarkerId;
        this.userId = data.userId;
        this.value = data.value;
        this.date = data.date;
        this.recommendationRange = data.recommendationRange;
        this.deviation = data.deviation;
        this.unitId = data.unitId;
        this.filterId = data.filterId;
        this.unit = data.unit && new UnitDto(data.unit);
        this.biomarker = data.biomarker && new UserResultBiomarkerDto(data.biomarker);
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly biomarkerId: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly value: number;

    @ApiProperty({ type: () => String, required: true })
    readonly date: string;

    @ApiProperty({ type: () => Number, required: false, description: EnumHelper.toDescription(RecommendationTypes) })
    readonly recommendationRange: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly deviation: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly unitId: number;

    @ApiProperty({ type: () => Number, required: false })
    readonly filterId: number;

    @ApiProperty({ type: () => UnitDto, required: true })
    readonly unit: UnitDto;

    @ApiProperty({ type: () => UserResultBiomarkerDto, required: true })
    readonly biomarker: UserResultBiomarkerDto;
}