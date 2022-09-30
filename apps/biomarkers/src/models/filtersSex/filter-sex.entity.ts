import { SexTypes } from '../../../../common/src/resources/filters/sex-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';

@Scopes(() => ({
}))

@Table({
    tableName: 'filterSexes',
    timestamps: true,
    underscored: false
})

export class FilterSex extends Model {
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
    sex: SexTypes;
}