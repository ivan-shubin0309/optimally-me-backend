import { UserRoles } from '../../../common/src/resources/users';
import { Table, Column, Model, Scopes, DataType, BeforeCreate, BeforeUpdate, HasOne } from 'sequelize-typescript';
import { PasswordHelper } from '../../../common/src/utils/helpers/password.helper';
import { UserWefitter } from '../../../wefitter/src/models/user-wefitter.entity';
import { UserAdditionalField } from './user-additional-field.entity';
import { UserHautAiField } from '../../../haut-ai/src/models/user-haut-ai-field.entity';
import { AdditionalAuthenticationTypes } from '../../../common/src/resources/users-mfa-devices/additional-authentication-types';

@Scopes(() => ({
    byRoles: (role: number) => ({
        where: { role }
    }),
    byId: (id: number) => ({ where: { id } }),
    byEmail: (email: string) => ({ where: { email } }),
    withWefitter: () => ({
        include: [
            {
                model: UserWefitter,
                as: 'wefitter',
                required: false,
            }
        ]
    }),
    pagination: (query) => ({ limit: query.limit, offset: query.offset }),
    withAdditionalField: () => ({
        include: [
            {
                model: UserAdditionalField,
                as: 'additionalField',
                required: false,
            }
        ]
    }),
    withHautAiField: () => ({
        include: [
            {
                model: UserHautAiField,
                as: 'hautAiField',
                required: false,
            }
        ]
    }),
}))
@Table({
    tableName: 'users',
    timestamps: true,
    underscored: false
})
export class User extends Model {
    @Column({
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: UserRoles.user
    })
    role: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    salt: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    lastName: string;

    @Column({
        type: DataType.TINYINT,
        allowNull: true
    })
    additionalAuthenticationType: AdditionalAuthenticationTypes;

    @HasOne(() => UserWefitter, 'userId')
    wefitter: UserWefitter;

    @HasOne(() => UserAdditionalField, 'userId')
    additionalField: UserAdditionalField;

    @HasOne(() => UserHautAiField, 'userId')
    hautAiField: UserHautAiField;

    @BeforeCreate
    static hashPasswordBeforeCreate(model) {
        if (model.password) {
            model.salt = PasswordHelper.generateSalt();
            model.password = PasswordHelper.hash(model.password + model.salt);
        }
    }

    @BeforeUpdate
    static hashPasswordBeforeUpdate(model) {
        if (model.password && model.changed('password')) {
            model.salt = PasswordHelper.generateSalt();
            model.password = PasswordHelper.hash(model.password + model.salt);
        }
    }

}