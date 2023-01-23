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
            [literal('IF(`UserWefitterHeartrateSummary`.`timestamp` IS NULL, `dailySummary`.`date`, `UserWefitterHeartrateSummary`.`timestamp`)'), 'date']
        ]
    }),
    orderByDate: () => ({
        order: [
            ['date', 'desc']
        ]
    }),
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

    @BelongsTo(() => UserWefitterDailySummary, 'dailySummaryId')
    dailySummary: UserWefitterDailySummary;
}