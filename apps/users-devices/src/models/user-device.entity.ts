import { UserWefitter } from '../../../wefitter/src/models/user-wefitter.entity';
import { Table, Column, Model, DataType, ForeignKey, Scopes, BelongsTo } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { Op } from 'sequelize';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    bySessionId: (sessionId) => ({ where: { sessionId } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    withConnectedSDK: () => ({
        include: [
            {
                model: User,
                as: 'user',
                required: true,
                include: [{
                    model: UserWefitter,
                    as: 'wefitter',
                    required: true,
                    where: {
                        [Op.or]: [
                            { isAppleHealthConnected: true },
                            { isSamsungHealthConnected: true },
                            { isAndroidSdkConnected: true },
                        ]
                    }
                }]
            }
        ]
    }),
}))
@Table({
    tableName: 'userDevices',
    timestamps: true,
    underscored: false
})
export class UserDevice extends Model {
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
    token: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    sessionId: string;

    @BelongsTo(() => User, 'userId')
    user: User;
}