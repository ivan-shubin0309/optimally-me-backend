import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';
import { Op, fn, col } from 'sequelize';
import { Unit } from '../../../biomarkers/src/models/units/unit.entity';
import { Filter } from '../../../biomarkers/src/models/filters/filter.entity';
import { RecommendationTypes } from '../../../common/src/resources/recommendations/recommendation-types';
import { UserRecommendation } from '../../../biomarkers/src/models/userRecommendations/user-recommendation.entity';
import { SkinUserResult } from '../../../haut-ai/src/models/skin-user-result.entity';
import { Hl7Object } from '../../../hl7/src/models/hl7-object.entity';
import { DnaAgeResult } from '../../../dna-age/src/models/dna-age-result.entity';

export interface IUserResult {
    readonly value: number,
    readonly userId: number,
    readonly biomarkerId: number,
    readonly date: string,
    readonly filterId?: number,
    readonly skinUserResultId?: number,
    readonly recommendationRange?: number,
    readonly createdAt?: string,
}

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    byUserId: (userId) => ({ where: { userId } }),
    byBiomarkerId: (biomarkerId) => ({ where: { biomarkerId } }),
    byDateAndBiomarkerId: (data: Array<{ date: string, biomarkerId: number, userId: number }>) => ({ where: { [Op.or]: data } }),
    withUnit: () => ({
        include: [
            {
                model: Unit,
                as: 'unit',
                required: false,
            },
        ]
    }),
    withBiomarker: () => ({
        include: [
            {
                model: Biomarker,
                as: 'biomarker',
                required: false,
            },
        ]
    }),
    resultCounters: () => ({
        attributes: {
            include: [
                ['biomarkerId', 'biomarkerId'],
                [fn('COUNT', '*'), 'value']
            ]
        },
        group: ['biomarkerId']
    }),
    distinctDates: () => ({
        group: ['date']
    }),
    distinctDatesCount: () => ({
        attributes: [[fn('COUNT', fn('DISTINCT', col('date'))), 'counter']],
    }),
    byFilterId: (filterId) => ({ where: { filterId } }),
    byDate: (startDate?: string, endDate?: string, fieldName = 'date') => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { [fieldName]: { [Op.and]: opAnd } } };
    },
    withFilter: () => ({
        include: [
            {
                model: Filter,
                as: 'filter',
                required: false,
            },
        ]
    }),
    filterCount: () => ({
        attributes: [
            [fn('COUNT', col('filterId')), 'counter'],
            'filterId'
        ],
        group: ['filterId']
    }),
    averages: () => ({
        attributes: [
            [fn('AVG', col('value')), 'averageValue'],
            [fn('MIN', col('value')), 'minValue'],
            [fn('MAX', col('value')), 'maxValue'],
            'biomarkerId',
        ],
        group: ['biomarkerId']
    }),
    bySkinUserResultId: (skinUserResultId: number) => ({ where: { skinUserResultId } }),
    withUserRecommendation: (userId: number, recommendationIds: number | number[], isRequired = true) => ({
        include: [
            {
                model: UserRecommendation,
                as: 'userRecommendations',
                required: isRequired,
                where: {
                    userId,
                    recommendationId: recommendationIds
                }
            },
        ],
        where: {
            userId
        }
    }),
    byHl7ObjectId: (hl7ObjectId) => ({ where: { hl7ObjectId } }),
    withHl7Object: () => ({
        include: [
            {
                model: Hl7Object,
                as: 'hl7Object',
                required: false,
            },
        ]
    }),
    byBiomarkerType: (biomarkerType) => ({
        include: [
            {
                model: Biomarker,
                as: 'biomarker',
                required: true,
                where: {
                    type: biomarkerType
                },
                attributes: []
            },
        ]
    }),
    byDnaAgeResultId: (dnaAgeResultId) => ({ where: { dnaAgeResultId } }),
}))
@Table({
    tableName: 'userResults',
    timestamps: true,
    underscored: false
})
export class UserResult extends Model {
    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    value: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    date: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
    })
    recommendationRange: RecommendationTypes;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    deviation: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    percentile: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @ForeignKey(() => Biomarker)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    biomarkerId: number;

    @ForeignKey(() => Unit)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    unitId: number;

    @ForeignKey(() => Filter)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    filterId: number;

    @ForeignKey(() => SkinUserResult)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    skinUserResultId: number;

    @ForeignKey(() => Hl7Object)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    hl7ObjectId: number;

    @ForeignKey(() => DnaAgeResult)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    dnaAgeResultId: number;

    @BelongsTo(() => Unit)
    unit: Unit;

    @BelongsTo(() => Biomarker)
    biomarker: Biomarker;

    @HasMany(() => UserRecommendation, 'userResultId')
    userRecommendations: UserRecommendation[];

    @BelongsTo(() => Filter)
    filter: Filter;

    @BelongsTo(() => SkinUserResult, 'skinUserResultId')
    skinUserResult: SkinUserResult;

    @BelongsTo(() => Hl7Object, 'hl7ObjectId')
    hl7Object: Hl7Object;
}