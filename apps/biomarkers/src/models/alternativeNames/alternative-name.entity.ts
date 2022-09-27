import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Biomarker } from '../index';

@Scopes(() => ({

}))
@Table({
    tableName: 'alternativeNames',
    timestamps: true,
    underscored: false
})
export class AlternativeName extends Model {
    @ForeignKey(() => Biomarker)
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