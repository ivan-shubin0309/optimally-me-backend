import { Table, Column, Model, Scopes, DataType, ForeignKey, HasMany, BelongsTo, DefaultScope } from 'sequelize-typescript';
import { LibraryRule } from '../index';
import { LibraryFilterRecommendation } from '../filterRecommendations/library-filter-recommendation.entity';
import { LibraryFilterSex } from '../filtersSex/library-filter-sex.entity';
import { LibraryFilterAge } from '../filtersAge/library-filter-age.entity';
import { LibraryFilterEthnicity } from '../filterEthnicity/library-filter-ethnicity.entity';
import { LibraryFilterOtherFeature } from '../filterOtherFeatures/library-filter-other-feature.entity';

@DefaultScope(() => ({
    include: [
        {
            model: LibraryFilterRecommendation,
            as: 'recommendations',
        },
        {
            model: LibraryFilterSex,
            as: 'sexFilters',
        },
        {
            model: LibraryFilterAge,
            as: 'ageFilters',
        },
        {
            model: LibraryFilterEthnicity,
            as: 'ethnicityFilters',
        },
        {
            model: LibraryFilterOtherFeature,
            as: 'otherFeatureFilters',
        }
    ]
}))
@Scopes(() => ({
}))
@Table({
    tableName: 'filtersLibrary',
    timestamps: true,
    underscored: false
})
export class LibraryFilter extends Model {

    @ForeignKey(() => LibraryRule)
    @Column({
        type: DataType.NUMBER,
        allowNull: false
    })
    ruleId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name: string;

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
    HighMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    HighMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    criticalHigh: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    recommendationsIsOn: boolean;

    @BelongsTo(() => LibraryRule, 'id')
    libraryRule: LibraryRule;

    @HasMany(() => LibraryFilterSex, 'filterId')
    sexFilters: LibraryFilterSex[];

    @HasMany(() => LibraryFilterAge, 'filterId')
    ageFilters: LibraryFilterAge[];

    @HasMany(() => LibraryFilterEthnicity, 'filterId')
    ethnicityFilters: LibraryFilterEthnicity[];

    @HasMany(() => LibraryFilterOtherFeature, 'filterId')
    otherFeatureFilters: LibraryFilterOtherFeature[];

    @HasMany(() => LibraryFilterRecommendation, 'filterId')
    recommendations: LibraryFilterRecommendation[];
}