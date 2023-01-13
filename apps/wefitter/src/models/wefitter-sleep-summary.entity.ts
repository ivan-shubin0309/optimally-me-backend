import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byUserId: (userId) => ({ where: { userId } }),
    byTimestamp: (timestamp) => ({ where: { timestamp } }),
}))
@Table({
    tableName: 'userWefitterSleepSummary',
    timestamps: true,
    underscored: false
})
export class UserWefitterSleepSummary extends Model {
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
        allowNull: true
    })
    source: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    duration: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    awake: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    light: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    deep: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    rem: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    sleepScore: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    totalTimeInSleep: string;
}