import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { BaseService } from '../../common/src/base/base.service';
import { IUserResult, UserResult } from './models/user-result.entity';

@Injectable()
export class AdminsResultsService extends BaseService<UserResult> {
  constructor(
    @Inject('USER_RESULT_MODEL') protected model: Repository<UserResult>,
  ) { super(model); }

  create(body: IUserResult, transaction?: Transaction): Promise<UserResult> {
    return this.model.create({ ...body }, { transaction });
  }

  async bulkCreate(data: IUserResult[], transaction?: Transaction): Promise<void> {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await this.model.bulkCreate(data, { transaction });
  }
}
