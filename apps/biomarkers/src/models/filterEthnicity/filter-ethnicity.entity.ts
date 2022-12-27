import { EthnicityTypes } from '../../../../common/src/resources/filters/ethnicity-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';

@Scopes(() => ({
    byFilterId: (filterId) => ({ where: { filterId } }),
}))

@Table({
    tableName: 'filterEthnicities',
    timestamps: true,
    underscored: false
})

export class FilterEthnicity extends Model {
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
    ethnicity: EthnicityTypes;
}