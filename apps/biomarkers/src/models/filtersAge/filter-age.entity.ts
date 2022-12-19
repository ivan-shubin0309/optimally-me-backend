import { AgeTypes } from '../../../../common/src/resources/filters/age-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';

@Scopes(() => ({
    byFilterId: (filterId) => ({ where: { filterId } }),
}))

@Table({
    tableName: 'filterAges',
    timestamps: true,
    underscored: false
})

export class FilterAge extends Model {
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
    age: AgeTypes;
}