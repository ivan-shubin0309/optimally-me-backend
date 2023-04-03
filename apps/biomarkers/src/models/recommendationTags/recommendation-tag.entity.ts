import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Recommendation } from '../recommendations/recommendation.entity';
import { fn, col, Op } from 'sequelize';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byRecommendationId: (recommendationId) => ({ where: { recommendationId } }),
    distinctNames: () => ({
        attributes: [[fn('DISTINCT', col('name')), 'name']],
    }),
    distinctNamesCount: () => ({
        attributes: [[fn('COUNT', fn('DISTINCT', col('name'))), 'counter']],
    }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    search: (searchString) => ({ where: { name: { [Op.like]: `%${searchString}%` } } }),
}))
@Table({
    tableName: 'recommendationTags',
    timestamps: true,
    underscored: false
})
export class RecommendationTag extends Model {
    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    recommendationId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
}