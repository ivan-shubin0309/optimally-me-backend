import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
    pagination: (query) => ({ limit: query.limit, offset: query.offset })
}))

@Table({
    tableName: 'categories',
    timestamps: true,
    underscored: false
})

export class Recommendation extends Model {

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    categories: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    content: string;
}