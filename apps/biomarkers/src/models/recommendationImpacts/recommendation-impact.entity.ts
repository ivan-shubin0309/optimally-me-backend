import { Table, Column, Model, DataType, Scopes, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Biomarker } from '../biomarker.entity';
import { Recommendation } from '../recommendations/recommendation.entity';
import { ImpactStudyLink } from './impact-study-link.entity';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    withBiomarker: () => ({
        include: [
            {
                model: Biomarker,
                as: 'biomarker',
                required: false,
            },
        ]
    }),
    withStudyLinks: () => ({
        include: [
            {
                model: ImpactStudyLink,
                as: 'studyLinks',
                required: false,
            },
        ]
    }),
    byRecommendationId: (recommendationId) => ({ where: { recommendationId } }),
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
        allowNull: true,
    })
    impactLevelHigh: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    qualityOfEvidenceHigh: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    strengthOfEvidenceHigh: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    descriptionLow: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    impactLevelLow: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    qualityOfEvidenceLow: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    strengthOfEvidenceLow: number;

    @HasMany(() => ImpactStudyLink, 'recommendationImpactId')
    studyLinks: ImpactStudyLink[];

    @BelongsTo(() => Biomarker, 'biomarkerId')
    biomarker: Biomarker;
}