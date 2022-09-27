import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Scopes(() => ({
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    byContent: (searchString: string) => ({
        where: { content: { [Op.like]: `%${searchString}%` } }
    }),
    byCategory: (category: number) => ({ where: { category } })
}))

@Table({
    tableName: 'recommendations',
    timestamps: true,
    underscored: false
})

export class Recommendation extends Model {

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    category: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    content: string;
}