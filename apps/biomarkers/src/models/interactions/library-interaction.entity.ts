import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LibraryRule } from '../index';

@Scopes(() => ({
}))
@Table({
    tableName: 'interactionsLibrary',
    timestamps: true,
    underscored: false
})
export class LibraryInteraction extends Model {

    @ForeignKey(() => LibraryRule)
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
        type: DataType.NUMBER,
        allowNull: true
    })
    impact: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    effects: string;

    @BelongsTo(() => LibraryRule, 'id')
    libraryRule: LibraryRule;
}