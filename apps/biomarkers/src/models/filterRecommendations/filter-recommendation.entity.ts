import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { BiomarkerFilter, Biomarker } from '../index';
import { Recommendation } from '../recommendations/recommendation.entity';

@Scopes(() => ({

}))
@Table({
    tableName: 'recommendationsFilter',
    timestamps: true,
    underscored: false
})
export class FilterRecommendation extends Model {

    @ForeignKey(() => BiomarkerFilter)
    @Column({
        type: DataType.NUMBER,
        allowNull: true,
    })
    filterId: number;

    @ForeignKey(() => Biomarker)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    biomarkerId: number;

    @ForeignKey(() => Recommendation)
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