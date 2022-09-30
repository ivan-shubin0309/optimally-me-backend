import { Injectable } from '@nestjs/common';
import { FilterCharacteristicsDto } from '../../models/filters/filter-characteristics.dto';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { SexTypes } from '../../../../common/src/resources/filters/sex-types';
import { AgeTypes } from '../../../../common/src/resources/filters/age-types';
import { EthnicityTypes } from '../../../../common/src/resources/filters/ethnicity-types';
import { OtherFeatureTypes } from '../../../../common/src/resources/filters/other-feature-types';


@Injectable()
export class FilterCharacteristicsService {
    getFilterCharacteristics(): FilterCharacteristicsDto {
        const allSexTypes = EnumHelper.toCollection(SexTypes);
        const allAgeTypes = EnumHelper.toCollection(AgeTypes);
        const allEthnicityTypes = EnumHelper.toCollection(EthnicityTypes);
        const allOtherFeatureTypes = EnumHelper.toCollection(OtherFeatureTypes);
        return new FilterCharacteristicsDto(allSexTypes, allAgeTypes, allEthnicityTypes, allOtherFeatureTypes);
    }
}