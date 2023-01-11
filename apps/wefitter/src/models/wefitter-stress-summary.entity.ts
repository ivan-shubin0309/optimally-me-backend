import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';

@Scopes(() => ({
    byDailySummaryId: (dailySummaryId) => ({ where: { dailySummaryId } }),
    byUserId: (userId) => ({ where: { userId } }),
    byTimestamp: (timestamp) => ({ where: { timestamp } }),
}))
@Table({
    tableName: 'userWefitterStressSummary',
    timestamps: true,
    underscored: false
})
export class UserWefitterStressSummary extends Model {
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
        type: DataType.STRING,
        allowNull: true,
    })
    stressQualifier: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    averageStressLevel: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    maxStressLevel: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    restStressDuration: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    lowStressDuration: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    mediumStressDuration: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    highStressDuration: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    stressDuration: string;
}