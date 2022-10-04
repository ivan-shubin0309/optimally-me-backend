import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    byId: (id) => ({ where: { id } }),
}))

@Table({
    tableName: 'categories',
    timestamps: true,
    underscored: false
})

export class Category extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;
}