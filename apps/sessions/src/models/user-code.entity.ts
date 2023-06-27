import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id: number) => ({
        where: { id }
    }),
    byCode: (code: string) => ({ where: { code } }),
    byUserId: (userId: number) => ({ where: { userId } }),
    bySessionToken: (sessionToken) => ({ where: { sessionToken } }),
    byRefreshToken: (refreshToken) => ({ where: { refreshToken } }),
}))
@Table({
    tableName: 'userCodes',
    timestamps: true,
    underscored: false
})
export class UserCode extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    code: string;

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
    sessionToken: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    refreshToken: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    expiresAt: Date|any;
}