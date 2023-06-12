import { Table, Column, Model, Scopes, DataType, ForeignKey, HasMany, HasOne } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { DateFilterTypes } from '../../../common/src/resources/hl7-templates/date-filter-types';
import { Op } from 'sequelize';
import { Hl7TemplateStatus } from './hl7-template-status.entity';
import { FavouriteHl7Template } from './favourite-hl7-template.entity';

@Scopes(() => ({
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    byId: (id) => ({ where: { id } }),
    byUserIdOrPublic: (userId) => ({
        where: {
            [Op.or]: [
                {
                    userId,
                    isPrivate: true
                },
                {
                    isPrivate: false
                }
            ]
        }
    }),
    byIsFavourite: (isFavourite) => ({ where: { isFavourite } }),
    search: (searchString) => ({
        where: {
            name: { [Op.like]: `%${searchString}%` }
        }
    }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    withStatuses: () => ({
        include: [
            {
                model: Hl7TemplateStatus,
                as: 'statuses',
                required: false,
            },
        ]
    }),
    withFavouriteHl7Template: (userId) => ({
        include: [
            {
                model: FavouriteHl7Template,
                as: 'favouriteHl7Template',
                required: false,
                where: { userId }
            },
        ]
    })
}))
@Table({
    tableName: 'hl7Templates',
    timestamps: true,
    underscored: false
})
export class Hl7Template extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    isPrivate: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    dateOfBirthStart: Date | any;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    dateOfBirthEnd: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    activatedAtStartDate: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    activatedAtEndDate: Date | any;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    activatedAtFilterType: DateFilterTypes;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    sampleAtStartDate: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    sampleAtEndDate: Date | any;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    sampleAtFilterType: DateFilterTypes;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    labReceivedAtStartDate: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    labReceivedAtEndDate: Date | any;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    labReceivedAtFilterType: DateFilterTypes;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    resultAtStartDate: Date | any;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    resultAtEndDate: Date | any;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    resultAtFilterType: DateFilterTypes;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    searchString: string;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true
    })
    activatedAtDaysCount: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true
    })
    sampleAtDaysCount: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true
    })
    labReceivedAtDaysCount: number;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true
    })
    resultAtDaysCount: number;

    @HasMany(() => Hl7TemplateStatus, 'hl7TemplateId')
    statuses: Hl7TemplateStatus[];

    @HasOne(() => FavouriteHl7Template, 'hl7TemplateId')
    favouriteHl7Template: FavouriteHl7Template;
}