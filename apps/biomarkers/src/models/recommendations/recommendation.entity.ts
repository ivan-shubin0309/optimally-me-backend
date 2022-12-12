import { RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';
import { Table, Column, Model, DataType, Scopes, BelongsToMany, HasMany, HasOne } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { File } from '../../../../files/src/models/file.entity';
import { RecommendationFile } from './recommendation-file.entity';
import { RecommendationImpact } from '../recommendationImpacts/recommendation-impact.entity';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { CollectionDto } from '../../../../common/src/models/enum-collecction.dto';
import { Filter } from '../filters/filter.entity';
import { FilterRecommendation } from './filter-recommendation.entity';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';
import { RecommendationReaction } from '../recommendationReactions/recommendation-reaction.entity';

@Scopes(() => ({
    byCategory: (category) => ({ where: { category } }),
    search: (searchString) => ({
        where: {
            [Op.or]: [
                { title: { [Op.like]: `%${searchString}%` } },
                {
                    category: EnumHelper
                        .toCollection(RecommendationCategoryTypes)
                        .filter((categoryType: CollectionDto) => categoryType.key.includes(searchString))
                        .map((categoryType: CollectionDto) => categoryType.value)
                }
            ]
        }
    }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    byId: (id) => ({ where: { id } }),
    withFiles: () => ({
        include: [
            {
                model: File,
                as: 'files',
                required: false,
            },
        ]
    }),
    withImpacts: (additionalScopes?: any[]) => ({
        include: [
            {
                model: RecommendationImpact.scope(additionalScopes),
                as: 'impacts',
                required: false,
            },
        ]
    }),
    byIsArchived: (isArchived: boolean) => ({ where: { isArchived } }),
    byFilterIdAndType: (arrayOfWhere: [{ type: RecommendationTypes, filterId: number }]) => ({
        include: [
            {
                model: FilterRecommendation,
                as: 'filterRecommendations',
                required: true,
                where: {
                    [Op.or]: arrayOfWhere
                }
            },
        ],
    }),
    withUserReaction: (userId) => ({
        include: [
            {
                model: RecommendationReaction,
                as: 'userReaction',
                required: false,
                where: { userId }
            },
        ],
    })
}))

@Table({
    tableName: 'recommendations',
    timestamps: true,
    underscored: false
})

export class Recommendation extends Model {
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    category: RecommendationCategoryTypes;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    content: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
    })
    type: RecommendationActionTypes;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    productLink: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isArchived: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isAddToCartAllowed: boolean;

    @BelongsToMany(() => File, () => RecommendationFile, 'recommendationId', 'fileId')
    files: File[];

    @HasMany(() => RecommendationImpact)
    impacts: RecommendationImpact[];

    @HasMany(() => FilterRecommendation, 'recommendationId')
    filterRecommendations: FilterRecommendation[];

    @HasOne(() => RecommendationReaction, 'recommendationId')
    userReaction: RecommendationReaction;
}