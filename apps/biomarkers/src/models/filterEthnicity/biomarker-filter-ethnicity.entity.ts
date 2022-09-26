import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { BiomarkerFilter } from '../index';

@Scopes(() => ({
}))

@Table({
    tableName: 'biomarkerFiltersEthnicity',
    timestamps: true,
    underscored: false
})

export class BiomarkerFilterEthnicity extends Model {
    
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
    ethnicity: number;
}