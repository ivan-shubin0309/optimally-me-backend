import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { UserSkinDiary } from './models/user-skin-diary.entity';

@Injectable()
export class UserSkinDiariesService extends BaseService<UserSkinDiary> {
    constructor(
        @Inject('USER_SKIN_DIARY_MODEL') protected model: Repository<UserSkinDiary>,
    ) { super(model); }

    create(body: any, transaction?: Transaction): Promise<UserSkinDiary> {
        return this.model.create(body, { transaction });
    }
}