import { TypeformQuizType } from '../../../common/src/resources/typeform/typeform-quiz-types';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id: number) => ({ where: { id } }),
    byUserId: (userId: number) => ({ where: { userId } })
}))
@Table({
    tableName: 'userQuizes',
    timestamps: true,
    underscored: false
})
export class UserQuiz extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    quizType: TypeformQuizType;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    typeformFormId: string;

}