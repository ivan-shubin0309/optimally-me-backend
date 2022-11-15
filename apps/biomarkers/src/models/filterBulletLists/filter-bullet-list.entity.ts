import { Filter } from '../filters/filter.entity';
import { Table, Column, Model, DataType, Scopes, ForeignKey, HasMany } from 'sequelize-typescript';
import { BulletListCategories, BulletListTypes } from '../../../../common/src/resources/filterBulletLists/bullet-list-types';
import { StudyLink } from './study-link.entity';

@Scopes(() => ({
    withStudyLinks: () => ({
        include: [
            {
                model: StudyLink,
                as: 'studyLinks',
                required: false,
            },
        ]
    }),
    byFilterId: (filterId) => ({ where: { filterId } }),
}))
@Table({
    tableName: 'filterBulletLists',
    timestamps: true,
    underscored: false
})

export class FilterBulletList extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    type: BulletListTypes;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: true,
    })
    category: BulletListCategories;

    @HasMany(() => StudyLink, 'filterBulletListId')
    studyLinks: StudyLink[];
}