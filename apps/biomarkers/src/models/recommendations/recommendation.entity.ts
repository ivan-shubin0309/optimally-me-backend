import { recommendationCategoryToString, RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';
import { Table, Column, Model, DataType, Scopes, BelongsToMany, HasMany, HasOne } from 'sequelize-typescript';
import { literal, Op } from 'sequelize';
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
import { Biomarker } from '../biomarker.entity';
import { UserRecommendation } from '../userRecommendations/user-recommendation.entity';
import { RecommendationReactionTypes } from '../../../../common/src/resources/recommendation-reactions/reaction-types';
import sequelize from 'sequelize';
import { countRecommendationBiomarkersQuery, minRecommendationOrderQuery } from '../../../../common/src/resources/recommendations/queries';
import { RecommendationTag } from '../recommendationTags/recommendation-tag.entity';

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
    withImpacts: (additionalScopes?: any[], biomarkerId?: number) => ({
        include: [
            {
                model: RecommendationImpact.scope(additionalScopes),
                as: 'impacts',
                required: false,
                where: { biomarkerId: biomarkerId || null },
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
                    filterId: filterIds
                }
            },
        ],
    }),
    withUserReaction: (userId, isExcludeDisliked = false) => ({
        include: [
            {
                model: RecommendationReaction,
                as: 'userReaction',
                required: false,
                where: { userId }
            },
        ],
        where: isExcludeDisliked
            ? {
                [Op.or]: [
                    { '$userReaction.reactionType$': { [Op.ne]: RecommendationReactionTypes.dislike } },
                    { '$userReaction.reactionType$': null }
                ]
            }
            : undefined,
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
    withUserRecommendation: (userResultId: number) => ({
        include: [
            {
                model: UserRecommendation,
                as: 'userRecommendation',
                required: false,
                where: {
                    userResultId
                }
            },
        ]
    }),
    orderByLiteral: (field: string, values: any[]) => ({
        order: [literal(`FIELD(\`Recommendation\`.\`${field}\`, ${values.join(',')}) ASC`)]
    }),
    orderByPriority: (orderType, userResultIds) => ({
        attributes: {
            include: [
                [sequelize.literal(`(${countRecommendationBiomarkersQuery(userResultIds)})`), 'biomarkersCount'],
                [sequelize.literal(`(${minRecommendationOrderQuery(userResultIds)})`), 'orderValue'],
            ]
        },
        order: [
            sequelize.literal(`IF(\`category\` = ${RecommendationCategoryTypes.doctor}, 1, 0) ${orderType}`),
            sequelize.literal(`\`biomarkersCount\` ${orderType}`),
            sequelize.literal(`\`orderValue\` ${orderType === 'desc' ? 'asc' : 'desc'}`)
        ],
    }),
    withRecommendationTag: () => ({
        include: [
            {
                model: RecommendationTag,
                as: 'tag',
                required: false,
            },
        ]
    }),
    bySkinType: (skinType) => ({
        include: [
            {
                model: RecommendationSkinType,
                as: 'skinTypes',
                required: true,
                where: { skinType }
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

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isDeletable: boolean;

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

    @HasOne(() => UserRecommendation, 'recommendationId')
    userRecommendation: UserRecommendation;

    @HasOne(() => RecommendationTag, 'recommendationId')
    tag: RecommendationTag;

    biomarkers: Biomarker[];
}