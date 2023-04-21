import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { WefitterMetricTypes } from '../../../common/src/resources/wefitter/wefitter-metric-types';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byMetricType: (metricType) => ({ where: { metricType } }),
    byUserId: (userId) => ({ where: { userId } }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
}))
@Table({
    tableName: 'userWidgetDataSources',
    timestamps: true,
    underscored: false
})
export class UserWidgetDataSource extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    source: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    metricType: WefitterMetricTypes;
}