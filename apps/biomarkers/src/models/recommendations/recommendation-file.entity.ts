import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Recommendation } from './recommendation.entity';
import { File } from '../../../../files/src/models/file.entity';
import { Op } from 'sequelize';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byFileIdAndRecommendationId: (data: Array<{ fileId: number, recommendationId: number }>) => ({ where: { [Op.or]: data } }),
}))

@Table({
    tableName: 'recommendationFiles',
    timestamps: true,
    underscored: false
})

export class RecommendationFile extends Model {
    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    recommendationId: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    fileId: number;
}