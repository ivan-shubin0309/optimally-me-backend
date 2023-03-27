import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserResult } from '../../admins-results/src/models/user-result.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class UsersResultsService extends BaseService<UserResult> {
    constructor(
        @Inject('USER_RESULT_MODEL') protected model: Repository<UserResult>,
    ) { super(model); }

    async removeResultsByObjectId(hl7ObjectId: number, transaction: Transaction): Promise<void> {
        await this.model
            .scope([{ method: ['byHl7ObjectId', hl7ObjectId] }])
            .destroy({ transaction });
    }
}

