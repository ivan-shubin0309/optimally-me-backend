import { FilterGroupTypes } from '../../../../common/src/resources/filterGroups/filter-group-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';

@Scopes(() => ({
    byFilterId: (filterId) => ({ where: { filterId } }),
}))
@Table({
    tableName: 'filterGroups',
    timestamps: true,
    underscored: false
})

export class FilterGroup extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    type: FilterGroupTypes;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    recommendationType: RecommendationTypes;
}