import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
}))

@Table({
    tableName: 'libraryFiltersAge',
    timestamps: true,
    underscored: false
})

export class LibraryFilterAge extends Model {

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
}