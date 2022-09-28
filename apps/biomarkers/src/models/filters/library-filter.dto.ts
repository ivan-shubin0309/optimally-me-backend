import { ApiProperty } from '@nestjs/swagger';
import { LibraryFilter } from './library-filter.entity';
import { LibraryFilterRecommendationDto } from '../filterRecommendations/library-filter-recommendation.dto';
import { LibraryFilterSexDto } from '../filtersSex/library-filter-sex.dto';
import { LibraryFilterAgeDto } from '../filtersAge/library-filter-age.dto';
import { LibraryFilterEthnicityDto } from '../filterEthnicity/library-filter-ethnicity.dto';
import { LibraryFilterOtherFeatureDto } from '../filterOtherFeatures/library-filter-other-feature.dto';



export class LibraryFilterDto {
    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly ruleId: number;

    @ApiProperty({ type: () => String, required: false })
    readonly name: string;

    @ApiProperty({ type: () => [LibraryFilterSexDto], required: false })
    readonly sexFilters: LibraryFilterSexDto[];

    @ApiProperty({ type: () => [LibraryFilterAgeDto], required: false })
    readonly ageFilters: LibraryFilterAgeDto[];

    @ApiProperty({ type: () => [LibraryFilterEthnicityDto], required: false })
    readonly ethnicityFilters: LibraryFilterEthnicityDto[];

    @ApiProperty({ type: () => [LibraryFilterOtherFeatureDto], required: false })
    readonly otherFeatureFilters: LibraryFilterOtherFeatureDto[];

    @ApiProperty({ type: () => Number, required: true })
    readonly criticalLow: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly lowMin: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly lowMax: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly subOptimalMin: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly subOptimalMax: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly optimalMin: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly optimalMax: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly supraOptimalMin: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly supraOptimalMax: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly highMin: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly highMax: number;

    @ApiProperty({ type: () => Number, required: true })
    readonly criticalHigh: number;

    @ApiProperty({ type: () => Boolean, required: true })
    readonly recommendationsIsOn: boolean;

    @ApiProperty({ type: () => [LibraryFilterRecommendationDto], required: false })
    readonly recommendations: LibraryFilterRecommendationDto[];

    constructor(entity: LibraryFilter) {
        this.id = entity.id;
        this.ruleId = entity.ruleId;
        this.name = entity.name;
        this.sexFilters = entity.sexFilters && entity.sexFilters.length
            ? entity.sexFilters.map(sexFilter => new LibraryFilterSexDto(sexFilter))
            : [];
        this.ageFilters = entity.ageFilters && entity.ageFilters.length
            ? entity.ageFilters.map(ageFilter => new LibraryFilterAgeDto(ageFilter))
            : [];
        this.ethnicityFilters = entity.ethnicityFilters && entity.ethnicityFilters.length
            ? entity.ethnicityFilters.map(ethnicityFilter => new LibraryFilterEthnicityDto(ethnicityFilter))
            : [];
        this.otherFeatureFilters = entity.otherFeatureFilters && entity.otherFeatureFilters.length
            ? entity.otherFeatureFilters.map(otherFeatureFilter => new LibraryFilterOtherFeatureDto(otherFeatureFilter))
            : [];
        this.criticalLow = entity.criticalLow;
        this.lowMin = entity.lowMin;
        this.lowMax = entity.lowMax;
        this.subOptimalMin = entity.subOptimalMin;
        this.subOptimalMax = entity.subOptimalMax;
        this.optimalMin = entity.optimalMin;
        this.optimalMax = entity.optimalMax;
        this.supraOptimalMin = entity.supraOptimalMin;
        this.supraOptimalMax = entity.supraOptimalMax;
        this.highMin = entity.HighMin;
        this.highMax = entity.HighMax;
        this.criticalHigh = entity.criticalHigh;
        this.recommendationsIsOn = entity.recommendationsIsOn;
        this.recommendations = entity.recommendations && entity.recommendations.length
            ? entity.recommendations.map(recommendation => new LibraryFilterRecommendationDto(recommendation))
            : [];
    }
}