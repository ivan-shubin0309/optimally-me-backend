import { Table, Column, Model, DataType, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LibraryFilter } from '../index';

@Scopes(() => ({
}))

@Table({
    tableName: 'libraryFiltersOtherFeatures',
    timestamps: true,
    underscored: false
})

export class LibraryFilterOtherFeature extends Model {

    @ForeignKey(() => LibraryFilter)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    otherFeature: number;

    @BelongsTo(() => LibraryFilter, 'id')
    filtersLibrary: LibraryFilter;
}