import { Table, Column, Model, Scopes, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Filter } from './filters/filter.entity';
import { Category } from './categories/category.entity';
import { Unit } from './units/unit.entity';
import { AlternativeName } from './alternativeNames/alternative-name.entity';
import { BiomarkerTypes } from 'apps/common/src/resources/biomarkers/biomarker-types';
import { Op } from 'sequelize';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byType: (type) => ({ where: { type } }),
    byName: (name) => ({ where: { name } }),
    includeAll: () => ({
        include: [
            /*{
                model: Filter.scope(['includeAll']),
                as: 'filters',
                required: false,
            },*/
            {
                model: AlternativeName,
                as: 'alternativeNames',
                required: false,
            },
        ]
    }),
    byIsDeleted: (isDeleted) => ({ where: { isDeleted } }),
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
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: BiomarkerTypes.biomarker
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
}