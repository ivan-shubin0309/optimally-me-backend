import { User } from '../../../users/src/models';
import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Biomarker } from '../../../biomarkers/src/models/biomarker.entity';
import { Op, fn, col } from 'sequelize';
import { Unit } from '../../../biomarkers/src/models/units/unit.entity';
import { Filter } from '../../../biomarkers/src/models/filters/filter.entity';
import { RecommendationTypes } from 'apps/common/src/resources/recommendations/recommendation-types';
import { UserRecommendation } from 'apps/biomarkers/src/models/userRecommendations/user-recommendation.entity';

export interface IUserResult {
    readonly value: number,
    readonly userId: number,
    readonly biomarkerId: number,
    readonly date: string,
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
        attributes: [[fn('DISTINCT', col('date')), 'date']],
    }),
    distinctDatesCount: () => ({
        attributes: [[fn('COUNT', fn('DISTINCT', col('date'))), 'counter']],
    }),
    byFilterId: (filterId) => ({ where: { filterId } }),
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

    @BelongsTo(() => Unit)
    unit: Unit;

    @BelongsTo(() => Biomarker)
    biomarker: Biomarker;

    @HasMany(() => UserRecommendation, 'userResultId')
    userRecommendations: UserRecommendation[];
}