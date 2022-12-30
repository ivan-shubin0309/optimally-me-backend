import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';
import { ContradictionTypes } from '../../../../common/src/resources/filters/contradiction-types';

@Scopes(() => ({
    byFilterId: (filterId) => ({ where: { filterId } }),
}))

@Table({
    tableName: 'filterContradictions',
    timestamps: true,
    underscored: false
})

export class FilterContradiction extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    contradictionType: ContradictionTypes;
}