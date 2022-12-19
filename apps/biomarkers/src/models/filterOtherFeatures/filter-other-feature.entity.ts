import { OtherFeatureTypes } from '../../../../common/src/resources/filters/other-feature-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';

@Scopes(() => ({
    byFilterId: (filterId) => ({ where: { filterId } }),
}))

@Table({
    tableName: 'filterOtherFeatures',
    timestamps: true,
    underscored: false
})

export class FilterOtherFeature extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    otherFeature: OtherFeatureTypes;
}