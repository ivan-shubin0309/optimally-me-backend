import { Table, Column, Model, DataType, ForeignKey, Scopes, BelongsTo } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { UserWefitterDailySummary } from './wefitter-daily-summary.entity';
import { fn, col, Op, literal } from 'sequelize';

@Scopes(() => ({
    byDailySummaryId: (dailySummaryId) => ({ where: { dailySummaryId } }),
    byUserId: (userId) => ({ where: { userId } }),
    byTimestamp: (timestamp) => ({ where: { timestamp } }),
    averages: (fieldName: string) => ({
        attributes: [
            [fn('AVG', col(fieldName)), 'averageValue'],
            [fn('MIN', col(fieldName)), 'minValue'],
            [fn('MAX', col(fieldName)), 'maxValue'],
            'userId',
        ],
        group: ['userId']
    }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    byFieldName: (fieldName) => ({
        include: [
            {
                model: UserWefitterDailySummary,
                as: 'dailySummary',
                required: false,
            },
        ],
        where: {
            [fieldName]: { [Op.ne]: null }
        },
        attributes: [
            [fieldName, 'value'],
            [literal('IF(`UserWefitterStressSummary`.`timestamp` IS NULL, `dailySummary`.`date`, `UserWefitterStressSummary`.`timestamp`)'), 'date']
        ]
    }),
    orderByDate: () => ({
        order: [
            ['date', 'desc']
        ]
    }),
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

    @BelongsTo(() => UserWefitterDailySummary, 'dailySummaryId')
    dailySummary: UserWefitterDailySummary;
}