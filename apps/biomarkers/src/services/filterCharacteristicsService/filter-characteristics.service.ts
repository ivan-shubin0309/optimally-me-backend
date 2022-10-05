import { Injectable } from '@nestjs/common';
import { FilterCharacteristicsDto } from '../../models/filters/filter-characteristics.dto';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { SexClientValues, SexTypes } from '../../../../common/src/resources/filters/sex-types';
import { AgeClientValues, AgeTypes } from '../../../../common/src/resources/filters/age-types';
import { EthnicityClienValues, EthnicityTypes } from '../../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureClientValues, OtherFeatureTypes } from '../../../../common/src/resources/filters/other-feature-types';


@Injectable()
export class FilterCharacteristicsService {
    getFilterCharacteristics(): FilterCharacteristicsDto {
        const allSexTypes = EnumHelper.toCollection(SexTypes, SexClientValues);
        const allAgeTypes = EnumHelper.toCollection(AgeTypes, AgeClientValues);
        const allEthnicityTypes = EnumHelper.toCollection(EthnicityTypes, EthnicityClienValues);
        const allOtherFeatureTypes = EnumHelper.toCollection(OtherFeatureTypes, OtherFeatureClientValues);
        return new FilterCharacteristicsDto(allSexTypes, allAgeTypes, allEthnicityTypes, allOtherFeatureTypes);
    }
}