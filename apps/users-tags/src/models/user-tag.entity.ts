import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { TypeformQuizType } from '../../../common/src/resources/typeform/typeform-quiz-types';

@Scopes(() => ({
    byUserId: (userId: number) => ({ where: { userId } }),
}))
@Table({
    tableName: 'userTags',
    timestamps: true,
    underscored: false
})
export class UserTag extends Model {
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
    key: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    type: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    value: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    quizType: TypeformQuizType;
}