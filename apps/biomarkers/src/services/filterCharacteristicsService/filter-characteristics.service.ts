import { Injectable } from '@nestjs/common';
import { CreateParamsHelper } from '../../../../common/src/utils/helpers/create-params.helper';
import { FilterSexesService } from '../filterSexes/filter-sexes.service';
import { FilterAgesService } from '../filterAges/filter-ages.service';
import { FilterEthnicityService } from '../filterEthnicity/filter-ethnicity.service';
import { FilterOtherFeaturesService } from '../filterOtherFeatures/filter-other-features.service';
import { AgeTypes } from '../filterAges/age-types';
import { SexTypes } from '../filterSexes/sex-types';
import { EthnicityTypes } from '../filterEthnicity/ethnicity-types';
import { OtherFeatureTypes } from '../filterOtherFeatures/other-feature-types';
import { FilterCharacteristicsDto } from '../../models/filters/filter-characteristics.dto';
import { EnumHelper } from 'apps/common/src/utils/helpers/enum.helper';


@Injectable()
export class FilterCharacteristicsService {
  constructor(
    private readonly createParamsHelper: CreateParamsHelper,
    private readonly filterSexesService: FilterSexesService,
    private readonly filterAgesService: FilterAgesService,
    private readonly filterEthnicityService: FilterEthnicityService,
    private readonly filterOtherFeaturesService: FilterOtherFeaturesService,
  ) {}

    async createFilterCharacteristics(filter, filterId): Promise<void> {
        if(filter.sexFilters && filter.sexFilters.length !== 0){
            for await (const sex of filter.sexFilters ) {
                const sexFilterParam = this.createParamsHelper.createParamsForSexFilter(filterId, sex);
                await this.filterSexesService.createBiomarkerFilterSex(sexFilterParam);
            }
        }
        if(filter.ageFilters && filter.ageFilters.length !== 0){
            for await (const age of filter.ageFilters ) {
                const ageFilterParam = this.createParamsHelper.createParamsForAgeFilter(filterId, age);
                await this.filterAgesService.createBiomarkerFilterAge(ageFilterParam);
            }
        }
        if(filter.ethnicityFilters && filter.ethnicityFilters.length !== 0){
            for await (const ethnicity of filter.ethnicityFilters ) {
                const ageFilterParam = this.createParamsHelper.createParamsForEthnicityFilter(filterId, ethnicity);
                await this.filterEthnicityService.createBiomarkerFilterEthnicity(ageFilterParam);
            }
        }
        if(filter.otherFeatures && filter.otherFeatures.length !== 0){
            for await (const otherFeature of filter.otherFeatures ) {
                const otherFeatureFilterParam = this.createParamsHelper.createParamsForOtherFeature(filterId, otherFeature);
                await this.filterOtherFeaturesService.createBiomarkerFilterOtherFeature(otherFeatureFilterParam);
            }
        }
    }

    async createLibraryFilterCharacteristics(filter, filterId): Promise<void> {
        if(filter.sexFilters && filter.sexFilters.length !== 0){
            for await (const sex of filter.sexFilters ) {
                const sexFilterParam = this.createParamsHelper.createParamsForSexFilter(filterId, sex);
                await this.filterSexesService.createLibraryFilterSex(sexFilterParam);
            }
        }
        if(filter.ageFilters && filter.ageFilters.length !== 0){
            for await (const age of filter.ageFilters ) {
                const ageFilterParam = this.createParamsHelper.createParamsForAgeFilter(filterId, age);
                await this.filterAgesService.createLibraryFilterAge(ageFilterParam);
            }
        }
        if(filter.ethnicityFilters && filter.ethnicityFilters.length !== 0){
            for await (const ethnicity of filter.ethnicityFilters ) {
                const ageFilterParam = this.createParamsHelper.createParamsForEthnicityFilter(filterId, ethnicity);
                await this.filterEthnicityService.createLibraryFilterEthnicity(ageFilterParam);
            }
        }
        if(filter.otherFeatures && filter.otherFeatures.length !== 0){
            for await (const otherFeature of filter.otherFeatures ) {
                const otherFeatureFilterParam = this.createParamsHelper.createParamsForOtherFeature(filterId, otherFeature);
                await this.filterOtherFeaturesService.createLibraryFilterOtherFeature(otherFeatureFilterParam);
            }
        }
    }

    getFilterCharacteristics(): FilterCharacteristicsDto {
        const allSexTypes = EnumHelper.toCollection(SexTypes);
        const allAgeTypes = EnumHelper.toCollection(AgeTypes);
        const allEthnicityTypes = EnumHelper.toCollection(EthnicityTypes);
        const allOtherFeatureTypes = EnumHelper.toCollection(OtherFeatureTypes);
        return new FilterCharacteristicsDto(allSexTypes, allAgeTypes, allEthnicityTypes, allOtherFeatureTypes);
    }
}