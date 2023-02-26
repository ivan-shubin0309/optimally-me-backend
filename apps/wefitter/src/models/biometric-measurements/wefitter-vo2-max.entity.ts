import { User } from '../../../../users/src/models';
import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { col, fn, Op } from 'sequelize';
import { DateTime } from 'luxon';

@Scopes(() => ({
    byUserId: (userId) => ({ where: { userId } }),
    byFieldName: (fieldName) => ({
        attributes: [
            [fieldName, 'value'],
            ['timestamp', 'date']
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
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderByDate: () => ({
        order: [
            ['timestamp', 'desc']
        ]
    }),
    withDailySummary: () => ({}),
    averages: (fieldName: string) => ({
        attributes: [
            [fn('AVG', col(fieldName)), 'averageValue'],
            [fn('MIN', col(fieldName)), 'minValue'],
            [fn('MAX', col(fieldName)), 'maxValue'],
            'userId',
        ],
        group: ['userId']
    }),
    bySource: (source) => ({ where: { source } }),
    byTimestamp: (timestamp) => ({ where: { timestamp } }),
    byId: (id) => ({ where: { id } }),
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
        allowNull: false
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