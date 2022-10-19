import { FileStatuses } from '../../../common/src/resources/files/file-statuses';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { FileTypes } from '../../../common/src/resources/files/file-types';

@Scopes(() => ({
    byId: (id: number | number[]) => ({ where: { id } }),
    byType: (type: number) => ({ where: { type } }),
    byUserId: (userId: number) => ({ where: { userId } }),
}))
@Table({
    tableName: 'files',
    timestamps: true,
    underscored: false
})
export class File extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    fileKey: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    status: FileStatuses; 

    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    type: FileTypes;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isUsed: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isResized: boolean;
}