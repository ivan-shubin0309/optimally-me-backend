import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({

}))
@Table({
    tableName: 'recommendationsFilter',
    timestamps: true,
    underscored: false
})
export class FilterRecommendation extends Model {
    @Column({
        type: DataType.NUMBER,
        allowNull: true,
    })
    filterId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    biomarkerId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    recommendationId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    type: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    recommendationOrder: number;
}