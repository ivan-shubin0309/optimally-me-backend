import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { ContradictionTypes } from '../../../../common/src/resources/filters/contradiction-types';
import { Recommendation } from '../recommendations/recommendation.entity';

@Scopes(() => ({
    byRecommendationId: (recommendationId) => ({ where: { recommendationId } }),
}))

@Table({
    tableName: 'recommendationContradictions',
    timestamps: true,
    underscored: false
})

export class RecommendationContradiction extends Model {
    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    recommendationId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    contradictionType: ContradictionTypes;
}