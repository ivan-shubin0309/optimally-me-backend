import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { fn, col, Op } from 'sequelize';
import { metricTypeToFieldName, WefitterMetricTypes } from '../../../common/src/resources/wefitter/wefitter-metric-types';

@Scopes(() => ({
    withIdAttribute: () => ({
        attributes: {
            include: [['id', 'id']]
        }
    }),
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
    byDate: (date) => ({ where: { date } }),
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
            'date'
        ]
    }),
    orderByDate: () => ({
        order: [
            ['date', 'desc']
        ]
    }),
    checkMetricAvailability: () => ({
        attributes: [
            [fn('COUNT', col(metricTypeToFieldName[WefitterMetricTypes.steps])), metricTypeToFieldName[WefitterMetricTypes.steps]],
            [fn('COUNT', col(metricTypeToFieldName[WefitterMetricTypes.caloriesBurned])), metricTypeToFieldName[WefitterMetricTypes.caloriesBurned]]
        ]
    }),
    byDateInterval: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { date: { [Op.and]: opAnd } } };
    },
    withDailySummary: () => ({}),
    bySource: (source) => ({ where: { source } }),
}))
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
        type: DataType.DATEONLY,
        allowNull: true,
    })
    date: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    distance: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    steps: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    calories: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    activeCalories: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    bmrCalories: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    points: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    source: string;
}