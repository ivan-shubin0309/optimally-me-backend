import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';
import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';
import { Recommendation } from './recommendation.entity';

@Scopes(() => ({
    includeAll: () => ({
        include: [
            {
                model: Recommendation,
                as: 'recommendation',
                required: false,
            }
        ]
    }),
    byFilterId: (filterId) => ({ where: { filterId } }),
}))
@Table({
    tableName: 'filterRecommendations',
    timestamps: true,
    underscored: false
})
export class FilterRecommendation extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    filterId: number;

    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    recommendationId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    order: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    type: RecommendationTypes;

    @BelongsTo(() => Recommendation)
    recommendation: Recommendation;
}