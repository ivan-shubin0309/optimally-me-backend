import { Filter } from '../filters/filter.entity';
import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { BulletListTypes } from '../../../../common/src/resources/filterBulletLists/bullet-list-types';

@Scopes(() => ({}))
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
}