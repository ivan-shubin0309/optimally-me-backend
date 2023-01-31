import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { FeelingTypes } from '../../../common/src/resources/haut-ai/feeling-types';

export interface ISkinUserResult {
    userHautAiFieldId: number;
    hautAiBatchId?: string;
    hautAiFileId?: string;
    itaScore?: number;
    fileId?: number;
}

@Scopes(() => ({
    byUserId: (userId: number) => ({ where: { userId } }),
}))
@Table({
    tableName: 'userSkinDiaries',
    timestamps: true,
    underscored: false
})
export class UserSkinDiary extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    feelingType: FeelingTypes;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: false
    })
    isWearingMakeUp: boolean;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    notes: string;
}