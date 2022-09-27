import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo, DefaultScope } from 'sequelize-typescript';
import { Recommendation } from '../recommendations/recommendation.entity';
import { LibraryFilter } from '../index';

@DefaultScope(() => ({
}))
@Scopes(() => ({
}))
@Table({
    tableName: 'recommendationsLibraryFilter',
    timestamps: true,
    underscored: false
})
export class LibraryFilterRecommendation extends Model {

    @ForeignKey(() => LibraryFilter)
    @Column({
        type: DataType.NUMBER,
        allowNull: true,
    })
    filterId: number;

    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    recommendationId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    type: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    recommendationOrder: number;

    @BelongsTo(() => LibraryFilter, 'Id')
    filterLibrary: LibraryFilter;
}
