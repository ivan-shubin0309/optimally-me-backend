import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
}))
@Table({
    tableName: 'userKlaviyo',
    timestamps: true,
    underscored: false
})
export class UserKlaviyo extends Model {
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
    klaviyoUserId: string;
}