import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'categories',
    timestamps: true,
    underscored: false
})

export class Categories extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
}