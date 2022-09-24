import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'alternativeNames',
    timestamps: true,
    underscored: false
})
export class AlternativeName extends Model {
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    biomarkerId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;
}