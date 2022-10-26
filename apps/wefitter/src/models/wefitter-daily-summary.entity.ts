import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Table({
    tableName: 'userWefitterDailySummary',
    timestamps: true,
    underscored: false
})
export class UserWefitterDailySummary extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true
    })
    userId: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    date: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    distance: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    steps: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    calories: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    activeCalories: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    bmrCalories: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    points: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    source: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    heartRateSummaryMin: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    heartRateSummaryMax: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    heartRateSummaryAverage: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    heartRateSummaryResting: number;

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