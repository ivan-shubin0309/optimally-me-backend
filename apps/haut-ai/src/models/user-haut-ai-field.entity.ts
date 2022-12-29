import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';

@Scopes(() => ({
    byUserId: (userId: number) => ({ where: { userId } }),
}))
@Table({
    tableName: 'userHautAiFields',
    timestamps: true,
    underscored: false
})
export class UserHautAiField extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    hautAiSubjectId: string;
}