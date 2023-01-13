import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';

@Scopes(() => ({
    byDailySummaryId: (dailySummaryId) => ({ where: { dailySummaryId } }),
    byUserId: (userId) => ({ where: { userId } }),
    byTimestamp: (timestamp) => ({ where: { timestamp } }),
}))
@Table({
    tableName: 'userWefitterHeartrateSummary',
    timestamps: true,
    underscored: false
})
export class UserWefitterHeartrateSummary extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true
    })
    userId: number;

    @ForeignKey(() => UserWefitterDailySummary)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    dailySummaryId: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    timestamp: string;

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
        type: DataType.INTEGER,
        allowNull: true,
    })
    min: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    max: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    average: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    resting: number;
}