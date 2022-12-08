import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, User } from './models';
import { Transaction } from 'sequelize/types';
import { ICreateUser } from './models/create-user.interface';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserAdditionalField } from './models/user-additional-field.entity';

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(
        @Inject('USER_MODEL') protected model: Repository<User>,
        @Inject('USER_ADDITIONAL_FIELD_MODEL') protected userAdditionalFieldModel: Repository<UserAdditionalField>
    ) { super(model); }

    getUserByEmail(email: string, scopes?: any[]): Promise<User> {
        return this.model
            .scope(scopes || [])
            .findOne({
                where: {
                    email
                }
            });
    }

    create(body: ICreateUser, transaction?: Transaction): Promise<User> {
        return this.model.create({ ...body }, { transaction });
    }

    async createWithAdditionalFields(body: CreateUserDto, transaction?: Transaction): Promise<User> {
        const user = await this.create(body, transaction);

        await this.userAdditionalFieldModel.create({ userId: user.id }, { transaction });

        return user;
    }

    getUser(userId: number, scopes?: any[], transaction?: Transaction): Promise<User> {
        return this.model
            .scope(scopes || [])
            .findByPk(userId, { transaction });
    }
}