import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({
    byId: (id: number) => ({ where: { id } }),
    byIsActivated: (isActivated) => ({ where: { isActivated } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    bySampleId: (sampleId) => ({ where: { sampleId } }),
}))
@Table({
    tableName: 'samples',
    timestamps: true,
    underscored: false
})
export class Sample extends Model {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    sampleId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    isActivated: boolean;
}