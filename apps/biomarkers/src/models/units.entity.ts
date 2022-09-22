import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'units',
    timestamps: true,
    underscored: false
})

export class Units extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    unit: string;
}