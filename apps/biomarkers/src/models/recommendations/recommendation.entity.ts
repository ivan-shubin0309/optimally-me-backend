import { recommendationCategoryToString, RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';
import { Table, Column, Model, DataType, Scopes, BelongsToMany, HasMany, HasOne } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { File } from '../../../../files/src/models/file.entity';
import { RecommendationFile } from './recommendation-file.entity';
import { RecommendationImpact } from '../recommendationImpacts/recommendation-impact.entity';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { CollectionDto } from '../../../../common/src/models/enum-collecction.dto';
import { FilterRecommendation } from './filter-recommendation.entity';
import { RecommendationTypes } from '../../../../common/src/resources/recommendations/recommendation-types';
import { RecommendationReaction } from '../recommendationReactions/recommendation-reaction.entity';
import { RecommendationSkinType } from '../recommendationSkinTypes/recommendation-skin-type.entity';
import { RecommendationContradiction } from '../recommendationContradictions/recommendation-contradiction.entity';
import { IdealTimeOfDayTypes } from '../../../../common/src/resources/recommendations/ideal-time-of-day-types';

@Scopes(() => ({
    byCategory: (category) => ({ where: { category } }),
    search: (searchString: string) => ({
        where: {
            [Op.or]: [
                { title: { [Op.like]: `%${searchString}%` } },
                {
                    category: EnumHelper
                        .toCollection(RecommendationCategoryTypes)
                        .filter((categoryType: CollectionDto) => recommendationCategoryToString[categoryType.value].includes(searchString.toLowerCase()))
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
    byFilterId: (filterIds: number[]) => ({
        include: [
            {
                model: FilterRecommendation,
                as: 'filterRecommendations',
                required: true,
                where: {
                    id: filterIds
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
    }),
    withFilterRecommendation: (filterId) => ({
        include: [
            {
                model: FilterRecommendation,
                as: 'filterRecommendation',
                required: false,
                where: { filterId }
            },
        ],
    }),
    withSkinTypes: () => ({
        include: [
            {
                model: RecommendationSkinType,
                as: 'skinTypes',
                required: false,
            },
        ]
    }),
    withContradictions: () => ({
        include: [
            {
                model: RecommendationContradiction,
                as: 'contradictions',
                required: false,
            },
        ]
    }),
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

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
    })
    idealTimeOfDay: IdealTimeOfDayTypes;

    @BelongsToMany(() => File, () => RecommendationFile, 'recommendationId', 'fileId')
    files: File[];

    @HasMany(() => RecommendationImpact)
    impacts: RecommendationImpact[];

    @HasMany(() => FilterRecommendation, 'recommendationId')
    filterRecommendations: FilterRecommendation[];

    @HasOne(() => RecommendationReaction, 'recommendationId')
    userReaction: RecommendationReaction;

    @HasOne(() => FilterRecommendation, 'recommendationId')
    filterRecommendation: FilterRecommendation;

    @HasMany(() => RecommendationSkinType, 'recommendationId')
    skinTypes: RecommendationSkinType[];

    @HasMany(() => RecommendationContradiction, 'recommendationId')
    contradictions: RecommendationContradiction[];
}