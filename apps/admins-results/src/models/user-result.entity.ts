import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';
import { Op } from 'sequelize';
import { Unit } from '../../../biomarkers/src/models/units/unit.entity';

export interface IUserResult {
    readonly value: number,
    readonly userId: number,
    readonly biomarkerId: number,
    readonly date: string,
}

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    byUserId: (userId) => ({ where: { userId } }),
    byBiomarkerId: (biomarkerId) => ({ where: { biomarkerId } }),
    byDateAndBiomarkerId: (data: Array<{ date: string, biomarkerId: number, userId: number }>) => ({ where: { [Op.or]: data } }),
    withUnit: () => ({
        include: [
            {
                model: Unit,
                as: 'unit',
                required: false,
            },
        ]
    }),
    withBiomarker: () => ({
        include: [
            {
                model: Biomarker,
                as: 'biomarker',
                required: false,
            },
        ]
    }),
}))
@Table({
    tableName: 'userResults',
    timestamps: true,
    underscored: false
})
export class UserResult extends Model {
    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    value: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    date: string;

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

    @ForeignKey(() => Unit)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    unitId: number;

    @BelongsTo(() => Unit)
    unit: Unit;

    @BelongsTo(() => Biomarker)
    biomarker: Biomarker;
}