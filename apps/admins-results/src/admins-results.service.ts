import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserResult } from './models/user-result.entity';

@Injectable()
export class AdminsResultsService extends BaseService<UserResult> {
  constructor(
    @Inject('USER_RESULT_MODEL') protected model: Repository<UserResult>,
  ) { super(model); }
}
