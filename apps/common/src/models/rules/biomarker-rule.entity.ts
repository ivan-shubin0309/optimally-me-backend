import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'biomarkerRules',
    timestamps: true,
    underscored: false
})
export class BiomarkerRule extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
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