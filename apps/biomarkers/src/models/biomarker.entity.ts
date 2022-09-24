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
        type: DataType.NUMBER,
        allowNull: true
    })
    userId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    categoryId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    unitId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    ruleId: number;
}