import { Table, Column, Model, DataType, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LibraryFilter } from '../index';

@Scopes(() => ({
}))

@Table({
    tableName: 'libraryFiltersEthnicity',
    timestamps: true,
    underscored: false
})

export class LibraryFilterEthnicity extends Model {

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
    ethnicity: number;

    @BelongsTo(() => LibraryFilter, 'id')
    filtersLibrary: LibraryFilter;
}