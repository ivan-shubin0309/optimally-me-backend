import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'biomarkers',
    timestamps: true,
    underscored: false
})
export class Biomarker extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    category: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    unit: number;
}