import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Biomarker } from '../biomarker.entity';

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
        allowNull: false
    })
    biomarkerId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;
}