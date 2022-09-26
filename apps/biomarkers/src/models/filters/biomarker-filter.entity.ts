import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'biomarkerFilters',
    timestamps: true,
    underscored: false
})
export class BiomarkerFilter extends Model {
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    ruleId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    criticalLow: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    lowMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    lowMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    subOptimalMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    subOptimalMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    optimalMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    optimalMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    supraOptimalMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    supraOptimalMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    HighMin: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    HighMax: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    criticalHigh: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    recommendationsIsOn: boolean;
}