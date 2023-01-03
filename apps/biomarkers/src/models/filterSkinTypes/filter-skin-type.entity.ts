import { Table, Column, Model, DataType, Scopes, ForeignKey } from 'sequelize-typescript';
import { Filter } from '../filters/filter.entity';
import { SkinTypes } from '../../../../common/src/resources/filters/skin-types';

@Scopes(() => ({
    byFilterId: (filterId) => ({ where: { filterId } }),
}))

@Table({
    tableName: 'filterSkinTypes',
    timestamps: true,
    underscored: false
})

export class FilterSkinType extends Model {
    @ForeignKey(() => Filter)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    skinType: SkinTypes;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isIdealSkinType: boolean;
}