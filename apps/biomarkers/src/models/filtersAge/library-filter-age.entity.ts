import { Table, Column, Model, DataType, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LibraryFilter } from '../index';

@Scopes(() => ({
}))

@Table({
    tableName: 'libraryFiltersAge',
    timestamps: true,
    underscored: false
})

export class LibraryFilterAge extends Model {

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
    age: number;

    @BelongsTo(() => LibraryFilter, 'id')
    filtersLibrary: LibraryFilter;
}