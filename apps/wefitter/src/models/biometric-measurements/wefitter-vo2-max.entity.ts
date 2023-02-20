import { User } from '../../../../users/src/models';
import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'wefitterVo2Max',
    timestamps: true,
    underscored: false
})
export class WefitterVo2Max extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true
    })
    userId: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    timestamp: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    timestampEnd: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    source: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    isManual: boolean;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    value: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    unit: string;
}