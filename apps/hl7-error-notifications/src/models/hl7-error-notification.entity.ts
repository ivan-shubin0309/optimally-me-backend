import { Hl7Object } from 'apps/hl7/src/models/hl7-object.entity';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    byIsResolved: (isResolved: boolean) => ({ where: { isResolved } }),
    byHl7ObjectId: (hl7ObjectId: number) => ({ where: { hl7ObjectId } }),
}))
@Table({
    tableName: 'hl7ObjectErrorNotifications',
    timestamps: true,
    underscored: false
})
export class Hl7ErrorNotification extends Model {
    @ForeignKey(() => Hl7Object)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    hl7ObjectId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    message: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        get() {
            return typeof this.getDataValue('isResolved') === 'object' || typeof this.getDataValue('isResolved') === 'undefined'
                ? this.getDataValue('isResolved')
                : !!this.getDataValue('isResolved');
        },
    })
    isResolved: boolean;
}