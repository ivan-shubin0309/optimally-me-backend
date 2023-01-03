import { RecommendationSkinTypes } from '../../../../common/src/resources/recommendations/skin-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Recommendation } from '../recommendations/recommendation.entity';

@Scopes(() => ({
    byRecommendationId: (recommendationId) => ({ where: { recommendationId } }),
}))

@Table({
    tableName: 'recommendationSkinTypes',
    timestamps: true,
    underscored: false
})

export class RecommendationSkinType extends Model {
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
    skinType: RecommendationSkinTypes;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isIdealSkinType: boolean;
}