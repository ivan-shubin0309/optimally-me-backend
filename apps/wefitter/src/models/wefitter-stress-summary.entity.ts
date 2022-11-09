import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

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