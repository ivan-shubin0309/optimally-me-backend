import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
}))

@Table({
    tableName: 'biomarkerFiltersAge',
    timestamps: true,
    underscored: false
})

export class BiomarkerFilterAge extends Model {

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