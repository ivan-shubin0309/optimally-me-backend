import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({
    byId: (id: number) => ({ where: { id } }),
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
    isActive: boolean;
}