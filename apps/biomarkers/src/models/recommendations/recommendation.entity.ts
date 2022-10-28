import { RecommendationCategoryTypes } from '../../../../common/src/resources/recommendations/recommendation-category-types';
import { Table, Column, Model, DataType, Scopes, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { RecommendationActionTypes } from '../../../../common/src/resources/recommendations/recommendation-action-types';
import { File } from '../../../../files/src/models/file.entity';
import { RecommendationFile } from './recommendation-file.entity';
import { RecommendationImpact } from '../recommendationImpacts/recommendation-impact.entity';
import { EnumHelper } from '../../../../common/src/utils/helpers/enum.helper';
import { CollectionDto } from '../../../../common/src/models/enum-collecction.dto';

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
    withImpacts: () => ({
        include: [
            {
                model: RecommendationImpact.scope('withBiomarker'),
                as: 'impacts',
                required: false,
            },
        ]
    }),
    byIsArchived: (isArchived: boolean) => ({ where: { isArchived } }),
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

    @BelongsToMany(() => File, () => RecommendationFile, 'recommendationId', 'fileId')
    files: File[];

    @HasMany(() => RecommendationImpact)
    impacts: RecommendationImpact[];
}