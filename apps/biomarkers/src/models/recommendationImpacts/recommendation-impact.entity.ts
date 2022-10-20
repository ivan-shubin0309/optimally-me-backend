import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Biomarker } from '../biomarker.entity';
import { Recommendation } from '../recommendations/recommendation.entity';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
}))

@Table({
    tableName: 'recommendationImpacts',
    timestamps: true,
    underscored: false
})

export class RecommendationImpact extends Model {
    @ForeignKey(() => Recommendation)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    recommendationId: number;

    @ForeignKey(() => Biomarker)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    biomarkerId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptionHigh: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    impactLevelHigh: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    qualityOfEvidenceHigh: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    strengthOfEvidenceHigh: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptionLow: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    impactLevelLow: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    qualityOfEvidenceLow: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    strengthOfEvidenceLow: number;
}