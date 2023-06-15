import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id: number | number[]) => ({ where: { id } }),
}))
@Table({
    tableName: 'dnaAgeResults',
    timestamps: true,
    underscored: false
})
export class DnaAgeResult extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;
}