import { MetricGraphViews } from '../../../common/src/resources/users-widgets/metric-graph-views';
import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
}))
@Table({
    tableName: 'userMetricGraphSettings',
    timestamps: true,
    underscored: false
})
export class UserMetricGraphSetting extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    startDate: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    endDate: Date | any;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    activeView: MetricGraphViews;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    activeMetrics: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    isCollapsed: boolean;
}