import { SkinUserResultStatuses } from '../../../common/src/resources/haut-ai/skin-user-result-statuses';
import { Table, Column, Model, Scopes, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { UserHautAiField } from './user-haut-ai-field.entity';
import { Op } from 'sequelize';
import { File } from '../../../files/src/models/file.entity';
import { UserSkinDiary } from './user-skin-diary.entity';

export interface ISkinUserResult {
    userHautAiFieldId: number;
    hautAiBatchId?: string;
    hautAiFileId?: string;
    itaScore?: number;
    fileId?: number;
}

@Scopes(() => ({
    byUserHautAiFieldId: (userHautAiFieldId: number) => ({ where: { userHautAiFieldId } }),
    byId: (id: number) => ({ where: { id } }),
    afterDate: (date: string) => ({ where: { createdAt: { [Op.gte]: date } } }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
    withFile: () => ({
        include: [
            {
                model: File,
                as: 'file',
                required: false,
            },
        ]
    }),
    withSkinDiary: () => ({
        include: [
            {
                model: UserSkinDiary,
                as: 'skinDiary',
                required: false,
            },
        ]
    }),
    byDate: (startDate?: string, endDate?: string) => {
        const opAnd = [];
        if (startDate) {
            opAnd.push({ [Op.gte]: startDate });
        }
        if (endDate) {
            opAnd.push({ [Op.lte]: endDate });
        }
        return { where: { createdAt: { [Op.and]: opAnd } } };
    },
    byStatus: (status) => ({ where: { status } }),
    byUserId: (userId) => ({
        include: [
            {
                model: UserHautAiField,
                as: 'userHautAiField',
                required: true,
                where: {
                    userId
                }
            },
        ]
    }),
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

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    fileId: number;

    @Column({
        type: DataType.TINYINT.UNSIGNED,
        allowNull: true
    })
    perceivedAge: number;

    @Column({
        type: DataType.TINYINT.UNSIGNED,
        allowNull: true
    })
    eyesAge: number;

    @BelongsTo(() => File, 'fileId')
    file: File;

    @HasOne(() => UserSkinDiary, 'skinUserResultId')
    skinDiary: UserSkinDiary;

    @BelongsTo(() => UserHautAiField, 'userHautAiFieldId')
    userHautAiField: UserHautAiField;
}