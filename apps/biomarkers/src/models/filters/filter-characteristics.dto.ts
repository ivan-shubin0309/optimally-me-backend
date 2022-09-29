import { ApiProperty } from '@nestjs/swagger';
import { AgeTypes } from 'apps/common/src/resources/filters/age-types';
import { EthnicityTypes } from 'apps/common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from 'apps/common/src/resources/filters/other-feature-types';
import { SexTypes } from 'apps/common/src/resources/filters/sex-types';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';

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