import { ImpactStudyLinkTypes } from '../../../../common/src/resources/recommendation-impacts/impact-study-link-types';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { RecommendationImpact } from './recommendation-impact.entity';

@Scopes(() => ({}))
@Table({
    tableName: 'impactStudyLinks',
    timestamps: true,
    underscored: false
})
export class ImpactStudyLink extends Model {
    @ForeignKey(() => RecommendationImpact)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    recommendationImpactId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    content: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    type: ImpactStudyLinkTypes;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title: string;
}