import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'interactionsLibrary',
    timestamps: true,
    underscored: false
})
export class LibraryInteraction extends Model {
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    ruleId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false
    })
    type: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    alsoKnowAs: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    impact: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    effects: string;
}