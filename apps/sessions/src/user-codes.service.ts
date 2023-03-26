import { Inject, Injectable } from '@nestjs/common';
import { CodeHelper } from '../../common/src/resources/common/code-helper';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserCode } from './models/user-code.entity';
import { USER_CODE_LENGTH } from '../../common/src/resources/user-codes/constants';

@Injectable()
export class UserCodesService extends BaseService<UserCode> {
    constructor(
        @Inject('USER_CODE_MODEL') protected readonly model: Repository<UserCode>,
    ) { super(model); }

    async generateCode(userId: number, sessionToken: string, refreshToken: string, expiresAt: string|number): Promise<UserCode> {
        const code = CodeHelper.generateCode(USER_CODE_LENGTH);
        const body = { userId, code, sessionToken, refreshToken, expiresAt };
        const userCode = await this.model
            .scope([{ method: ['byUserId', userId] }])
            .findOne();
        if(userCode) {
            return userCode.update(body);
        }
        return this.model.create(body);
    }
}
