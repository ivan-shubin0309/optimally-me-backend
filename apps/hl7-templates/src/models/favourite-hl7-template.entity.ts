import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Hl7Template } from './hl7-template.entity';
import { User } from '../../../users/src/models';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byHl7TemplateId: (hl7TemplateId) => ({ where: { hl7TemplateId } }),
    byUserId: (userId) => ({ where: { userId } }),
}))
@Table({
    tableName: 'favouriteHl7Templates',
    timestamps: true,
    underscored: false
})
export class FavouriteHl7Template extends Model {
    @ForeignKey(() => Hl7Template)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    hl7TemplateId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;
}