import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { BiomarkerRule } from '../index';

@Scopes(() => ({

}))
@Table({
    tableName: 'biomarkerInteractions',
    timestamps: true,
    underscored: false
})
export class BiomarkerInteraction extends Model {

    @ForeignKey(() => BiomarkerRule)
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