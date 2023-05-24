import { DashboardTabTypes } from '../../../common/src/resources/users-widgets/dashboard-tab-types';
import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
}))
@Table({
    tableName: 'userDashboardSettings',
    timestamps: true,
    underscored: false
})
export class UserDashboardSetting extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    isHeatmapCollapsed: boolean;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    chosenTabType: DashboardTabTypes;
}