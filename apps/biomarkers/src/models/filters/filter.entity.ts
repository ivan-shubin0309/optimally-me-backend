import { Table, Column, Model, Scopes, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { Biomarker } from '../biomarker.entity';
import { FilterEthnicity } from '../filterEthnicity/filter-ethnicity.entity';
import { FilterOtherFeature } from '../filterOtherFeatures/filter-other-feature.entity';
import { FilterAge } from '../filtersAge/filter-age.entity';
import { FilterSex } from '../filtersSex/filter-sex.entity';
import { Interaction } from '../interactions/interaction.entity';
import { FilterRecommendation } from '../recommendations/filter-recommendation.entity';

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
        ]
    }),
    byBiomarkerId: (biomarkerId) => ({ where: { biomarkerId } }),
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
        type: DataType.STRING,
        allowNull: true
    })
    whatAreTheCauses: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatAreTheRisks: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatCanYouDo: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    criticalLow: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    lowMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    lowMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    subOptimalMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    subOptimalMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    optimalMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    optimalMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    supraOptimalMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    supraOptimalMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    highMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    highMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
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
}