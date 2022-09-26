import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
    pagination: (query) => ({ limit: query.limit, offset: query.offset })
}))

@Table({
    tableName: 'units',
    timestamps: true,
    underscored: false
})

export class Unit extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    unit: string;
}