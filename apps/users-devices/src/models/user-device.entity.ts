import { Table, Column, Model, DataType, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    bySessionId: (sessionId) => ({ where: { sessionId } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
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
}