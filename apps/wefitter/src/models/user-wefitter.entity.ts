import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';


@Scopes(() => ({
    byUserId: (userId) => ({ where: { userId } }),
    byPublicId: (publicId) => ({ where: { publicId } }),
}))
@Table({
    tableName: 'userWefitter',
    timestamps: true,
    underscored: false
})
export class UserWefitter extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    publicId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    bearer: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    reference: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isAppleHealthConnected: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isSamsungHealthConnected: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isAndroidSdkConnected: boolean;
}