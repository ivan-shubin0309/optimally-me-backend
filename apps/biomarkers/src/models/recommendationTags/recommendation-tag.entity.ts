import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Recommendation } from '../recommendations/recommendation.entity';
import { fn, col } from 'sequelize';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byRecommendationId: (recommendationId) => ({ where: { recommendationId } }),
    distinctDates: () => ({
        attributes: [[fn('DISTINCT', col('date')), 'date']],
    }),
    distinctDatesCount: () => ({
        attributes: [[fn('COUNT', fn('DISTINCT', col('date'))), 'counter']],
    }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
}))
@Table({
    tableName: 'recommendationTags',
    timestamps: true,
    underscored: false
})
export class RecommendationTag extends Model {
    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    recommendationId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
}