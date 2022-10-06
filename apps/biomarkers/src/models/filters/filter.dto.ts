import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'apps/common/src/base/base.dto';
import { FilterEthnicityDto } from '../filterEthnicity/filter-ethnicity.dto';
import { FilterOtherFeatureDto } from '../filterOtherFeatures/filter-other-feature.dto';
import { FilterAgeDto } from '../filtersAge/filter-age.dto';
import { FilterSexDto } from '../filtersSex/filter-sex.dto';
import { InteractionDto } from '../interactions/interaction.dto';
import { FilterRecommendationDto } from '../recommendations/filter-recommendation.dto';
import { Filter } from './filter.entity';

export class FilterDto extends BaseDto<Filter> {
    constructor(entity: Filter) {
        super(entity);
        this.biomarkerId = entity.biomarkerId;
        this.name = entity.name;
        this.summary = entity.summary;
        this.whatIsIt = entity.whatIsIt;
        this.whatAreTheCauses = entity.whatAreTheCauses;
        this.whatAreTheRisks = entity.whatAreTheRisks;
        this.whatCanYouDo = entity.whatCanYouDo;
        this.criticalLow = entity.criticalLow;
        this.lowMin = entity.lowMin;
        this.lowMax = entity.lowMax;
        this.subOptimalMin = entity.subOptimalMin;
        this.subOptimalMax = entity.subOptimalMax;
        this.optimalMin = entity.optimalMin;
        this.optimalMax = entity.optimalMax;
        this.supraOptimalMin = entity.supraOptimalMin;
        this.supraOptimalMax = entity.supraOptimalMax;
        this.highMin = entity.highMin;
        this.highMax = entity.highMax;
        this.criticalHigh = entity.criticalHigh;
        this.filterRecommendations = entity.filterRecommendations && entity.filterRecommendations.length
            ? entity.filterRecommendations.map(filterRecommendation => new FilterRecommendationDto(filterRecommendation))
            : undefined;
        this.interactions = entity.interactions && entity.interactions.length
            ? entity.interactions.map(interaction => new InteractionDto(interaction))
            : undefined;
        this.ages = entity.ages && entity.ages.length
            ? entity.ages.map(age => new FilterAgeDto(age))
            : undefined;
        this.sexes = entity.sexes && entity.sexes.length
            ? entity.sexes.map(sex => new FilterSexDto(sex))
            : undefined;
        this.ethnicities = entity.ethnicities && entity.ethnicities.length
            ? entity.ethnicities.map(ethnicity => new FilterEthnicityDto(ethnicity))
            : undefined;
        this.otherFeatures = entity.otherFeatures && entity.otherFeatures.length
            ? entity.otherFeatures.map(otherFeature => new FilterOtherFeatureDto(otherFeature))
            : undefined;
    }

    @ApiProperty({ type: () => Number, required: true })
    biomarkerId: number;

    @ApiProperty({ type: () => String, required: true })
    name: string;

    @ApiProperty({ type: () => String, required: false })
    summary: string;

    @ApiProperty({ type: () => String, required: false })
    whatIsIt: string;

    @ApiProperty({ type: () => String, required: false })
    whatAreTheCauses: string;

    @ApiProperty({ type: () => String, required: false })
    whatAreTheRisks: string;

    @ApiProperty({ type: () => String, required: false })
    whatCanYouDo: string;

    @ApiProperty({ type: () => Number, required: false })
    criticalLow: number;

    @ApiProperty({ type: () => Number, required: false })
    lowMin: number;

    @ApiProperty({ type: () => Number, required: false })
    lowMax: number;

    @ApiProperty({ type: () => Number, required: false })
    subOptimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    subOptimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    optimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    optimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    supraOptimalMin: number;

    @ApiProperty({ type: () => Number, required: false })
    supraOptimalMax: number;

    @ApiProperty({ type: () => Number, required: false })
    highMin: number;

    @ApiProperty({ type: () => Number, required: false })
    highMax: number;

    @ApiProperty({ type: () => Number, required: false })
    criticalHigh: number;

    @ApiProperty({ type: () => [FilterRecommendationDto], required: false })
    filterRecommendations: FilterRecommendationDto[];

    @ApiProperty({ type: () => [InteractionDto], required: false })
    interactions: InteractionDto[];

    @ApiProperty({ type: () => [FilterAgeDto], required: false })
    ages: FilterAgeDto[];

    @ApiProperty({ type: () => [FilterSexDto], required: false })
    sexes: FilterSexDto[];

    @ApiProperty({ type: () => [FilterEthnicityDto], required: false })
    ethnicities: FilterEthnicityDto[];

    @ApiProperty({ type: () => [FilterOtherFeatureDto], required: false })
    otherFeatures: FilterOtherFeatureDto[];
}