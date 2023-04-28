import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserTag } from './models/user-tag.entity';
import { Transaction } from 'sequelize';
import { TypeformQuizType } from '../../common/src/resources/typeform/typeform-quiz-types';

export interface ICreateUserTag {
    key: string,
    value: string | number,
    type: string,
    userId: number,
    quizType: TypeformQuizType
}

@Injectable()
export class UsersTagsService extends BaseService<UserTag> {
    constructor(
        @Inject('USER_TAG_MODEL') protected model: Repository<UserTag>,
    ) { super(model); }

    bulkCreate(body: ICreateUserTag[], transaction?: Transaction): Promise<UserTag[]> {
        return this.model.bulkCreate(body as any[], { transaction });
    }

    async remove(userId: number, scopes: any[], transaction?: Transaction): Promise<void> {
        await this.model
            .scope([
                { method: ['byUserId', userId] },
                ...scopes
            ])
            .destroy({ transaction });
    }
}