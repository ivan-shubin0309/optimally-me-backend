import { ApiProperty } from '@nestjs/swagger';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';
import { SexTypes } from '../../services/filterSexes/sex-types';
import { AgeTypes } from '../../services/filterAges/age-types';
import { EthnicityTypes } from '../../services/filterEthnicity/ethnicity-types';
import { OtherFeatureTypes } from '../../services/filterOtherFeatures/other-feature-types';

export class FilterCharacteristicsDto {
    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(SexTypes) })
    readonly allSexTypes: number[];

    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(AgeTypes) })
    readonly allAgeTypes: number[];

    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(EthnicityTypes) })
    readonly allEthnicityTypes: number[];

    @ApiProperty({ type: () => Array<number>, description: EnumHelper.toDescription(OtherFeatureTypes) })
    readonly allOtherFeatureTypes: number[];

    constructor(allSexTypes: number[], allAgeTypes: number[], allEthnicityTypes: number[], allOtherFeatureTypes: number[]) {
        this.allSexTypes = allSexTypes;
        this.allAgeTypes = allAgeTypes;
        this.allEthnicityTypes = allEthnicityTypes;
        this.allOtherFeatureTypes = allOtherFeatureTypes;
    }
}