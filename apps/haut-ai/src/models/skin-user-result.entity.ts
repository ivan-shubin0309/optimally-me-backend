import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { UserHautAiField } from './user-haut-ai-field.entity';

@Scopes(() => ({
    byUserId: (userId: number) => ({ where: { userId } }),
}))
@Table({
    tableName: 'skinUserResults',
    timestamps: true,
    underscored: false
})
export class SkinUserResult extends Model {
    @ForeignKey(() => UserHautAiField)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userHautAiFieldId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    hautAiBatchId: string;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true
    })
    itaScore: number;
}