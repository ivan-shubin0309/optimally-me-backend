import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserDevice } from './models/user-device.entity';
import { Transaction } from 'sequelize/types';

interface ICreateUserDevice {
    userId: number,
    sessionId: string,
    token: string,
}

@Injectable()
export class UsersDevicesService extends BaseService<UserDevice> {
  constructor(
      @Inject('USER_DEVICE_MODEL') protected readonly model: Repository<UserDevice>,
  ) { super(model); }

    create(body: ICreateUserDevice, transaction?: Transaction): Promise<UserDevice> {
        return this.model.create(body as any, { transaction });
    }

    async removeDeviceBySessionId(sessionId: string): Promise<void> {
        await this.model
            .scope([
                { method: ['bySessionId', sessionId] }
            ])
            .destroy();
    }
}
