import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { UserQuiz } from './user-quiz.entity';

@Scopes(() => ({
    byId: (id: number) => ({ where: { id } }),
    byUserId: (userId: number) => ({ where: { userId } }),
    byQuizId: (quizId: number) => ({ where: { quizId } }),
}))
@Table({
    tableName: 'userQuizAnswers',
    timestamps: true,
    underscored: false
})
export class UserQuizAnswer extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @ForeignKey(() => UserQuiz)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    quizId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    questionId: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    questionText: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    answerType: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    answerText: string;
}