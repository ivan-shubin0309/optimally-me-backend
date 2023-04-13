import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { FeelingTypes } from '../../../common/src/resources/haut-ai/feeling-types';
import { SkinUserResult } from './skin-user-result.entity';

export interface ISkinUserResult {
    userHautAiFieldId: number;
    hautAiBatchId?: string;
    hautAiFileId?: string;
    itaScore?: number;
    fileId?: number;
}

@Scopes(() => ({
    byUserId: (userId: number) => ({ where: { userId } }),
    byId: (id: number) => ({ where: { id } }),
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

    @ForeignKey(() => SkinUserResult)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    skinUserResultId: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    feelingType: FeelingTypes;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    isWearingMakeUp: boolean;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    notes: string;
}