import { SkinUserResultStatuses } from '../../../common/src/resources/haut-ai/skin-user-result-statuses';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { UserHautAiField } from './user-haut-ai-field.entity';
import { Op } from 'sequelize';

export interface ISkinUserResult {
    userHautAiFieldId: number;
    hautAiBatchId?: string;
    hautAiFileId?: string;
    itaScore?: number;
}

@Scopes(() => ({
    byUserHautAiFieldId: (userHautAiFieldId: number) => ({ where: { userHautAiFieldId } }),
    byId: (id: number) => ({ where: { id } }),
    afterDate: (date: string) => ({ where: { createdAt: { [Op.gte]: date } } })
}))
@Table({
    tableName: 'skinUserResults',
    timestamps: true,
    underscored: false
})
export class SkinUserResult extends Model {
    @ForeignKey(() => UserHautAiField)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userHautAiFieldId: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    hautAiBatchId: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    hautAiFileId: string;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true
    })
    itaScore: number;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: SkinUserResultStatuses.processing
    })
    status: SkinUserResultStatuses;
}