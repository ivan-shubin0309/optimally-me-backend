import { Table, Column, Model, DataType, ForeignKey, Scopes, BelongsTo } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
    byDeviceToken: (deviceToken) => ({ where: { deviceToken } }),
    byIsMfaDevice: (isMfaDevice) => ({ where: { isMfaDevice } }),
    byDeviceId: (deviceId) => ({ where: { deviceId } }),
}))
@Table({
    tableName: 'userVerifiedDevices',
    timestamps: true,
    underscored: false
})
export class UserVerifiedDevice extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    deviceId: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    deviceToken: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isMfaDevice: boolean;

    @BelongsTo(() => User, 'userId')
    user: User;
}