import { Op } from 'sequelize';
import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
    byUserId: (userId) => ({ where: { userId } }),
    bySource: (source) => ({ where: { source } }),
    byAfterDate: (date) => ({ where: { date: { [Op.gte]: date } } }),
    withoutId: () => ({ attributes: { exclude: ['id'] } })
}))
@Table({
    tableName: 'lastDataSources',
    timestamps: false,
    underscored: false
})
export class LastDataSource extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    date: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    source: string;
}