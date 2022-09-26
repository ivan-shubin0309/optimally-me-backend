import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { BiomarkerFilter } from '../index';

@Scopes(() => ({
}))

@Table({
    tableName: 'biomarkerFiltersAge',
    timestamps: true,
    underscored: false
})

export class BiomarkerFilterAge extends Model {

    @ForeignKey(() => BiomarkerFilter)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    age: number;
}