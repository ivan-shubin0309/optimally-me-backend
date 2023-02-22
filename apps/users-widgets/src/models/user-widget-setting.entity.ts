import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byWidgetType: (widgetType) => ({ where: { widgetType } }),
    byUserId: (userId) => ({ where: { userId } }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
}))
@Table({
    tableName: 'userWidgetSettings',
    timestamps: true,
    underscored: false
})
export class UserWidgetSetting extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    widgetType: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    order: number;
}