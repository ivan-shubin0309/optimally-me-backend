import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { BiomarkerFilter } from '../index';

@Scopes(() => ({
}))

@Table({
    tableName: 'biomarkerFiltersSex',
    timestamps: true,
    underscored: false
})

export class BiomarkerFilterSex extends Model {

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
    sex: number;
}