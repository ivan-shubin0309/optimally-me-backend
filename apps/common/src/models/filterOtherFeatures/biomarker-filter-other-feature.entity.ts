import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
}))

@Table({
    tableName: 'biomarkerFiltersOtherFeatures',
    timestamps: true,
    underscored: false
})

export class BiomarkerFilterOtherFeature extends Model {

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    filterId: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    otherFeature: number;
}