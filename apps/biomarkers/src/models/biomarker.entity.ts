import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models/user.entity';
import { Category, Unit, BiomarkerRule } from '../models';

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

    @ForeignKey(() => User)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    userId: number;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    categoryId: number;

    @ForeignKey(() => Unit)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    unitId: number;

    @ForeignKey(() => BiomarkerRule)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    ruleId: number;
}