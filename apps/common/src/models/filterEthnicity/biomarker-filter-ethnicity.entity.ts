import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
}))

@Table({
    tableName: 'biomarkerFiltersEthnicity',
    timestamps: true,
    underscored: false
})

export class BiomarkerFilterEthnicity extends Model {

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