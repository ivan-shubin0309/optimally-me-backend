import { Hl7ObjectStatuses } from '../../../common/src/resources/hl7/hl7-object-statuses';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Hl7Template } from './hl7-template.entity';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byHl7TemplateId: (hl7TemplateId) => ({ where: { hl7TemplateId } }),
}))
@Table({
    tableName: 'hl7TemplateStatuses',
    timestamps: true,
    underscored: false
})
export class Hl7TemplateStatus extends Model {
    @ForeignKey(() => Hl7Template)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    hl7TemplateId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    status: Hl7ObjectStatuses;
}