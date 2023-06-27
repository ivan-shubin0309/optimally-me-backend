import { Inject, Injectable } from '@nestjs/common';
import { CodeHelper } from '../../common/src/resources/common/code-helper';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserCode } from './models/user-code.entity';
import { USER_CODE_LENGTH } from '../../common/src/resources/user-codes/constants';
import { ScopeOptions } from 'sequelize';

@Injectable()
export class UserCodesService extends BaseService<UserCode> {
    constructor(
        @Inject('USER_CODE_MODEL') protected readonly model: Repository<UserCode>,
    ) { super(model); }

    async generateCode(userId: number, sessionToken: string, refreshToken: string, expiresAt: string|number): Promise<UserCode> {
        const code = CodeHelper.generateCode(USER_CODE_LENGTH);
        const body = { userId, code, sessionToken, refreshToken, expiresAt };
        return this.model.create(body);
    }

    async destroy(scopes: ScopeOptions[]): Promise<void> {
        await this.model
            .scope(scopes)
            .destroy();
    }
}
