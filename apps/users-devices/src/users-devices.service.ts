import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class UsersDevicesService extends BaseService<> {
  constructor(
    @Inject('') protected readonly model: Repository<>,
  ) { super(model); }
}
