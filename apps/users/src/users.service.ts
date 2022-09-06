import { Inject, Injectable } from '@nestjs/common';
import { User } from './models';
import { Transaction } from 'sequelize/types';
import { ICreateUser } from './models/create-user.interface';

@Injectable()
export class UsersService {
    constructor( 
        @Inject('USER_MODEL') private userModel: typeof User
    ) {}

    getUserByEmail(email: string, scopes?: any[]): Promise<User> {
        return this.userModel
            .scope(scopes || [])
            .findOne({
                where: {
                    email
                }
            });
    }

    create(body: ICreateUser): Promise<User> {
        return this.userModel.create({ ...body });
    }

    getUser(userId: number, scopes?: any[], transaction?: Transaction): Promise<User> {
        return this.userModel
            .scope(scopes || [])
            .findByPk(userId, { transaction });
    }
}