import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
}))

@Table({
    tableName: 'libraryFiltersEthnicity',
    timestamps: true,
    underscored: false
})

export class LibraryFilterEthnicity extends Model {

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
}