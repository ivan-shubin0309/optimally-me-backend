import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';

@Scopes(() => ({}))
@Table({
    tableName: 'filterSummaries',
    timestamps: true,
    underscored: false
})
export class FilterSummary extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    filterId: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    criticalLow: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    low: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    subOptimal: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    optimal: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    supraOptimal: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    high: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    criticalHigh: string;
}