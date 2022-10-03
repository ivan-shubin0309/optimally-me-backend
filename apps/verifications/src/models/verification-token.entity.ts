import { TokenTypes } from '../../../common/src/resources/verificationTokens/token-types';
import { Table, Column, Model, Scopes, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../../users/src/models';
import { Op } from 'sequelize';

@Scopes(() => ({
    byId: (id: number) => ({
        where: { id }
    }),
    byType: (type: TokenTypes) => ({ where: { type } }),
    byToken: (token: string) => ({ where: { token } }),
    byUserId: (userId: number) => ({ where: { userId } }),
    byAfterDate: (date: string) => ({
        where: {
            createdAt: { [Op.gte]: date }
        }
    })
}))
@Table({
    tableName: 'verificationTokens',
    timestamps: true,
    underscored: false
})
export class VerificationToken extends Model {
    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: TokenTypes.password
    })
    type: TokenTypes;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    isUsed: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    token: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;
}