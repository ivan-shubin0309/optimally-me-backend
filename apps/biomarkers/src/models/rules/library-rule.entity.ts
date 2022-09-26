import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'rulesLibrary',
    timestamps: true,
    underscored: false
})
export class LibraryRule extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    summary: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatIsIt: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatAreTheCauses: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatAreTheRisks: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    whatCanYouDo: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    interactionsIsOn: boolean;
}