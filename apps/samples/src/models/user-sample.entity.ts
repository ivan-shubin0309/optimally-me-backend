import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Sample } from './sample.entity';

@Scopes(() => ({
    byId: (id: number) => ({ where: { id } }),
}))
@Table({
    tableName: 'userSamples',
    timestamps: true,
    underscored: false
})
export class UserSample extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @ForeignKey(() => Sample)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    sampleId: number;
}