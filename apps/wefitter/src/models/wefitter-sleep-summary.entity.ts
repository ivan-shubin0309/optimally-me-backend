import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { fn, col, Op } from 'sequelize';
import { metricTypeToFieldName, WefitterMetricTypes } from '../../../common/src/resources/wefitter/wefitter-metric-types';
import { DateTime } from 'luxon';

@Scopes(() => ({
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
        where: {
            [fieldName]: { [Op.ne]: null }
        },
        attributes: [
            [fieldName, 'value'],
            ['timestamp', 'date']
        ]
    }),
    orderByDate: () => ({
        order: [
            ['date', 'desc']
        ]
    }),
    checkMetricAvailability: () => ({
        attributes: [
            [fn('COUNT', col(metricTypeToFieldName[WefitterMetricTypes.timeAsleep])), metricTypeToFieldName[WefitterMetricTypes.timeAsleep]],
            [fn('COUNT', col(metricTypeToFieldName[WefitterMetricTypes.sleepScore])), metricTypeToFieldName[WefitterMetricTypes.sleepScore]]
        ]
    }),
    byDateInterval: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: DateTime.fromFormat(endDate, 'yyyy-MM-dd').endOf('day').toISO() });
        }
        return { where: { timestamp: { [Op.and]: opAnd } } };
    },
    withDailySummary: () => ({}),
    bySource: (source) => ({ where: { source } }),
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