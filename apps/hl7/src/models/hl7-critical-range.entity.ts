import { Op } from 'sequelize';
import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byNameAndValue: (name: string, value: number) => ({
        where: {
            name,
            [Op.or]: [
                {
                    minRange: {
                        [Op.and]: [
                            { [Op.ne]: null },
                            { [Op.gte]: value }
                        ]
                    }
                },
                {
                    maxRange: {
                        [Op.and]: [
                            { [Op.ne]: null },
                            { [Op.lte]: value }
                        ]
                    }
                }
            ]
        }
    })
}))
@Table({
    tableName: 'hl7CriticalRanges',
    timestamps: true,
    underscored: false
})
export class Hl7CriticalRange extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name: string;

    @Column({
        type: DataType.DECIMAL,
        allowNull: true
    })
    minRange: number;

    @Column({
        type: DataType.DECIMAL,
        allowNull: true
    })
    maxRange: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    reportingUnits: string;
}