import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({
    byId: (id) => ({ where: { id } }),
    byFileName: (fileName) => ({ where: { fileName } }),
}))
@Table({
    tableName: 'hl7FileErrors',
    timestamps: true,
    underscored: false
})
export class Hl7FileError extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    fileName: string;
}