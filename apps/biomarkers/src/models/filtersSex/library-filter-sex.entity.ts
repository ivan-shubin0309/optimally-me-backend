import { Table, Column, Model, DataType, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LibraryFilter } from '../index';

@Scopes(() => ({
}))

@Table({
    tableName: 'libraryFiltersSex',
    timestamps: true,
    underscored: false
})

export class LibraryFilterSex extends Model {

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
    sex: number;

    @BelongsTo(() => LibraryFilter, 'id')
    filtersLibrary: LibraryFilter;
}