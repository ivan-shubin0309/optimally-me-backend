import { Table, Column, Model, Scopes, DataType, ForeignKey, HasMany, BelongsTo, HasOne } from 'sequelize-typescript';
import { Filter } from './filters/filter.entity';
import { Category } from './categories/category.entity';
import { Unit } from './units/unit.entity';
import { AlternativeName } from './alternativeNames/alternative-name.entity';
import { BiomarkerTypes } from '../../../common/src/resources/biomarkers/biomarker-types';
import { Op, literal, fn } from 'sequelize';
import { UserResult } from '../../../admins-results/src/models/user-result.entity';
import { getLastUserResultsForEachBiomarker, OrderValueQuery } from '../../../common/src/resources/usersBiomarkers/queries';
import { BiomarkerSexTypes } from '../../../common/src/resources/biomarkers/biomarker-sex-types';
import { RecommendationTypes } from '../../../common/src/resources/recommendations/recommendation-types';
import { HautAiMetricTypes } from 'apps/common/src/resources/haut-ai/haut-ai-metric-types';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byType: (type) => ({ where: { type } }),
    byName: (name) => ({ where: { name } }),
    withAlternativeNames: () => ({
        include: [
            {
                model: AlternativeName,
                as: 'alternativeNames',
                required: false,
            },
        ]
    }),
    withFilters: () => ({
        include: [
            {
                model: Filter,
                as: 'filters',
                required: false,
            },
        ]
    }),
    byIsDeleted: (isDeleted) => ({ where: { isDeleted } }),
    byIsActive: (isActive) => ({ where: { isActive } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    withUnit: () => ({
        include: [
            {
                model: Unit,
                as: 'unit',
                required: false,
            },
        ]
    }),
    withCategory: (isRequired = false) => ({
        include: [
            {
                model: Category,
                as: 'category',
                required: isRequired,
            },
        ]
    }),
    subQuery: (isEnabled: boolean) => ({ subQuery: isEnabled }),
    search: (searchString) => ({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${searchString}%` } },
                { '$category.name$': { [Op.like]: `%${searchString}%` } }
            ]
        }
    }),
    byCategoryId: (categoryIds: number | number[]) => ({ where: { categoryId: categoryIds } }),
    withRule: () => ({
        include: [
            {
                model: Biomarker,
                as: 'rule',
                required: false,
            },
        ]
    }),
    withLastResults: (userId: number, numberOfLastResults: number, isWithAttributes = true, isRequired = false, beforeDate?: string, additionalScopes?: any[]) => ({
        include: [
            {
                model: UserResult.scope(additionalScopes),
                as: 'userResults',
                required: isRequired,
                where: {
                    id: literal(`\`userResults\`.\`id\` IN (${getLastUserResultsForEachBiomarker(userId, numberOfLastResults, beforeDate)})`)
                },
                attributes: isWithAttributes
                    ? undefined
                    : []
            },
        ]
    }),
    withLastResult: (resultIds: number[], isRequired = false) => ({
        include: [
            {
                model: UserResult,
                as: 'lastResult',
                required: isRequired,
                where: literal(`\`lastResult\`.\`id\` IN (${resultIds.length ? resultIds.join(', ') : 'NULL'})`),
            },
        ]
    }),
    rangeCounters: () => ({
        attributes: [
            [literal('`lastResult`.`recommendationRange`'), 'recommendationRange'],
            [fn('COUNT', '*'), 'value']
        ],
        group: ['recommendationRange']
    }),
    orderByDeviation: (orderType: string) => ({
        attributes: {
            include: [literal(OrderValueQuery)] as any,
        },
        order: [
            [literal('`orderValue`'), orderType],
            [literal('`lastResult`.`deviation`'), orderType],
            [literal('`category.name`'), orderType === 'desc' ? 'asc' : 'desc'],
            [literal('`Biomarker`.`label`'), orderType === 'desc' ? 'asc' : 'desc']
        ]
    }),
    orderByLiteral: (field: string, values: any[]) => ({
        order: [literal(`FIELD(${field}, ${values.join(',')}) ASC`), literal('`userResults`.`date` DESC')]
    }),
    bySex: (sex: BiomarkerSexTypes) => ({ where: { sex } }),
    searchByNames: (searchString) => ({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${searchString}%` } },
                { label: { [Op.like]: `%${searchString}%` } },
                { shortName: { [Op.like]: `%${searchString}%` } }
            ]
        }
    }),
    byRecommendationRange: (range: RecommendationTypes[]) => ({ where: { '$lastResult.recommendationRange$': range } }),
    searchByResult: (searchString) => ({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${searchString}%` } },
                { '$lastResult.date$': { [Op.like]: `%${searchString}%` } },
                { '$lastResult.value$': { [Op.like]: `%${searchString}%` } }
            ]
        }
    }),
}))
@Table({
    tableName: 'biomarkers',
    timestamps: true,
    underscored: false
})
export class Biomarker extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    label: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    shortName: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: BiomarkerTypes.blood
    })
    type: number;

    @ForeignKey(() => Biomarker)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    templateId: number;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    categoryId: number;

    @ForeignKey(() => Unit)
    @Column({
        type: DataType.NUMBER,
        allowNull: true
    })
    unitId: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isDeleted: boolean;

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
    })
    sex: BiomarkerSexTypes;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    isActive: boolean;

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
    })
    hautAiMetricType: HautAiMetricTypes;

    @HasMany(() => AlternativeName)
    alternativeNames: AlternativeName[];

    @HasMany(() => Filter, 'biomarkerId')
    filters: Filter[];

    @BelongsTo(() => Category)
    category: Category;

    @BelongsTo(() => Unit)
    unit: Unit;

    @BelongsTo(() => Biomarker, 'templateId')
    rule: Biomarker;

    @HasMany(() => UserResult, 'biomarkerId')
    userResults: UserResult[];

    @HasOne(() => UserResult, 'biomarkerId')
    lastResult: UserResult[];

    resultsCount?: number;
}