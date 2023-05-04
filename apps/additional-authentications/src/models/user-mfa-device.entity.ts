import { Table, Column, Model, DataType, ForeignKey, Scopes, BelongsTo } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
    byDeviceToken: (deviceToken) => ({ where: { deviceToken } }),
}))
@Table({
    tableName: 'userMfaDevices',
    timestamps: true,
    underscored: false
})
export class UserMfaDevice extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    deviceToken: string;

    @BelongsTo(() => User, 'userId')
    user: User;
}