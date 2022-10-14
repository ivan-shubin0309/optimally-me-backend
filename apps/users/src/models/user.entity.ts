import { UserRoles } from '../../../common/src/resources/users';
import { Table, Column, Model, Scopes, DataType, BeforeCreate, BeforeUpdate, HasOne } from 'sequelize-typescript';
import { PasswordHelper } from '../../../common/src/utils/helpers/password.helper';
import { UserWefitter } from '../../../wefitter/src/models/user-wefitter.entity';

@Scopes(() => ({
    byRoles: (role: number) => ({
        where: { role }
    }),
    byId: (id: number) => ({ where: { id } }),
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

    @HasOne(() => UserWefitter, 'userId')
    wefitter: UserWefitter;

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