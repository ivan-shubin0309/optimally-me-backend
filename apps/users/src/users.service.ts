import { Inject, Injectable } from '@nestjs/common';
import { User } from './models';
import { Transaction } from 'sequelize/types';
import { ICreateUser } from './models/create-user.interface';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(
        @Inject('USER_MODEL') protected model: Repository<User>
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

    getUser(userId: number, scopes?: any[], transaction?: Transaction): Promise<User> {
        return this.model
            .scope(scopes || [])
            .findByPk(userId, { transaction });
    }
}