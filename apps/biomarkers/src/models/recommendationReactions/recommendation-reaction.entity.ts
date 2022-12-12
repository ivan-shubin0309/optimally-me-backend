import { RecommendationReactionTypes } from '../../../../common/src/resources/recommendation-reactions/reaction-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Recommendation } from '../recommendations/recommendation.entity';
import { User } from '../../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byUserId: (userId) => ({ where: { userId } }),
    byRecommendationId: (recommendationId) => ({ where: { recommendationId } }),
}))

@Table({
    tableName: 'recommendationReactions',
    timestamps: true,
    underscored: false
})

export class RecommendationReaction extends Model {
    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    recommendationId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    reactionType: RecommendationReactionTypes;
}