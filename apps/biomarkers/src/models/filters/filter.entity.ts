import { getFiltersAllQuery, getSpecificFiltersQuery, ISpecificFiltersQueryOptions } from '../../../../common/src/resources/biomarkers/queries';
import { Table, Column, Model, Scopes, DataType, ForeignKey, HasMany, HasOne, BelongsTo } from 'sequelize-typescript';
import { Biomarker } from '../biomarker.entity';
import { FilterBulletList } from '../filterBulletLists/filter-bullet-list.entity';
import { FilterEthnicity } from '../filterEthnicity/filter-ethnicity.entity';
import { FilterGroup } from '../filterGroups/filter-group.entity';
import { FilterOtherFeature } from '../filterOtherFeatures/filter-other-feature.entity';
import { FilterAge } from '../filtersAge/filter-age.entity';
import { FilterSex } from '../filtersSex/filter-sex.entity';
import { FilterSummary } from '../filterSummaries/filter-summary.entity';
import { Interaction } from '../interactions/interaction.entity';
import { FilterRecommendation } from '../recommendations/filter-recommendation.entity';
import sequelize from 'sequelize';
import { FilterSkinType } from '../filterSkinTypes/filter-skin-type.entity';
import { FilterContradiction } from '../filterContradictions/filter-contradiction.entity';

const PRECISION = 19;
const SCALE = 9;

@Scopes(() => ({
    includeAll: () => ({
        include: [
            {
                model: Interaction,
                as: 'interactions',
                required: false,
            },
            {
                model: FilterAge,
                as: 'ages',
                required: false,
            },
            {
                model: FilterSex,
                as: 'sexes',
                required: false,
            },
            {
                model: FilterEthnicity,
                as: 'ethnicities',
                required: false,
            },
            {
                model: FilterOtherFeature,
                as: 'otherFeatures',
                required: false,
            },
            {
                model: FilterGroup,
                as: 'groups',
                required: false
            },
            {
                model: FilterSummary,
                as: 'resultSummary',
                required: false
            }
        ]
    }),
    byBiomarkerId: (biomarkerId) => ({ where: { biomarkerId } }),
    byBiomarkerIdsAndCharacteristics: (biomarkerIds: number[], options: ISpecificFiltersQueryOptions) => ({
        where: { id: sequelize.literal(`id IN (${getSpecificFiltersQuery(biomarkerIds, options)})`) }
    }),
    byBiomarkerIdAndAllFilter: (biomarkerIds: number[]) => ({ where: { id: sequelize.literal(`id IN (${getFiltersAllQuery(biomarkerIds)})`) } }),
    byId: (id) => ({ where: { id } }),
    withBiomarker: () => ({
        include: [
            {
                model: Biomarker,
                as: 'biomarker',
                required: false,
            },
        ]
    }),
}))
@Table({
    tableName: 'filters',
    timestamps: true,
    underscored: false
})
export class Filter extends Model {
    @ForeignKey(() => Biomarker)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    biomarkerId: number;

    @ForeignKey(() => Biomarker)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    removedFromBiomarkerId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    summary: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatIsIt: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    whatAreTheCausesLow: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    whatAreTheCausesHigh: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    whatAreTheRisksLow: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    whatAreTheRisksHigh: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatCanYouDo: string;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('criticalLow') && parseFloat(this.getDataValue('criticalLow').toString());
        }
    })
    criticalLow: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('lowMin') && parseFloat(this.getDataValue('lowMin').toString());
        }
    })
    lowMin: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('lowMax') && parseFloat(this.getDataValue('lowMax').toString());
        }
    })
    lowMax: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('subOptimalMin') && parseFloat(this.getDataValue('subOptimalMin').toString());
        }
    })
    subOptimalMin: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('subOptimalMax') && parseFloat(this.getDataValue('subOptimalMax').toString());
        }
    })
    subOptimalMax: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('optimalMin') && parseFloat(this.getDataValue('optimalMin').toString());
        }
    })
    optimalMin: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('optimalMax') && parseFloat(this.getDataValue('optimalMax').toString());
        }
    })
    optimalMax: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('supraOptimalMin') && parseFloat(this.getDataValue('supraOptimalMin').toString());
        }
    })
    supraOptimalMin: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('supraOptimalMax') && parseFloat(this.getDataValue('supraOptimalMax').toString());
        }
    })
    supraOptimalMax: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('highMin') && parseFloat(this.getDataValue('highMin').toString());
        }
    })
    highMin: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('highMax') && parseFloat(this.getDataValue('highMax').toString());
        }
    })
    highMax: number;

    @Column({
        type: DataType.DECIMAL(PRECISION, SCALE),
        allowNull: true,
        get() {
            return this.getDataValue('criticalHigh') && parseFloat(this.getDataValue('criticalHigh').toString());
        }
    })
    criticalHigh: number;

    @HasMany(() => FilterRecommendation, 'filterId')
    filterRecommendations: FilterRecommendation[];

    @HasMany(() => Interaction, 'filterId')
    interactions: Interaction[];

    @HasMany(() => FilterAge, 'filterId')
    ages: FilterAge[];

    @HasMany(() => FilterSex, 'filterId')
    sexes: FilterSex[];

    @HasMany(() => FilterEthnicity, 'filterId')
    ethnicities: FilterEthnicity[];

    @HasMany(() => FilterOtherFeature, 'filterId')
    otherFeatures: FilterOtherFeature[];

    @HasMany(() => FilterGroup, 'filterId')
    groups: FilterGroup[];

    @HasOne(() => FilterSummary, 'filterId')
    resultSummary: FilterSummary;

    @HasMany(() => FilterBulletList, 'filterId')
    bulletList: FilterBulletList[];

    @BelongsTo(() => Biomarker, 'biomarkerId')
    biomarker: Biomarker;

    @HasMany(() => FilterSkinType, 'filterId')
    skinTypes: FilterSkinType[];

    @HasMany(() => FilterContradiction, 'filterId')
    contradictions: FilterContradiction[];
}