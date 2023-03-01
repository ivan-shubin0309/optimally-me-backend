import { UserResult } from '../../../../admins-results/src/models/user-result.entity';
import { Table, Column, Model, DataType, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../../../users/src/models';
import { Recommendation } from '../recommendations/recommendation.entity';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    withUserResult: () => ({
        include: [
            {
                model: UserResult,
                as: 'userResult',
                required: false,
            },
        ],
    }),
    withRecommendation: () => ({
        include: [
            {
                model: Recommendation,
                as: 'recommendation',
                required: false,
            },
        ],
    }),
    byUserResultId: (userResultId) => ({ where: { userResultId } }),
    byRecommendationId: (recommendationId) => ({ where: { recommendationId } }),
    byIsExcluded: (isExcluded) => ({ where: { isExcluded } }),
}))

@Table({
    tableName: 'userRecommendations',
    timestamps: true,
    underscored: false
})

export class UserRecommendation extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    recommendationId: number;

    @ForeignKey(() => UserResult)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userResultId: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isExcluded: boolean;

    @BelongsTo(() => Recommendation)
    recommendation: Recommendation;

    @BelongsTo(() => UserResult)
    userResult: UserResult;
}