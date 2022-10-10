import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
}))
@Table({
    tableName: 'userResults',
    timestamps: true,
    underscored: false
})
export class UserResult extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    value: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @ForeignKey(() => Biomarker)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    biomarkerId: number;
}