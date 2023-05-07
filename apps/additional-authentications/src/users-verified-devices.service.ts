import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserVerifiedDevice } from './models/user-verified-device.entity';

interface ICreateVerifiedDevice {
    userId: number;
    deviceId: string;
    deviceToken?: string;
    isMfaDevice: boolean;
}

@Injectable()
export class UsersVerifiedDevicesService extends BaseService<UserVerifiedDevice> {
    constructor(
        @Inject('USER_VERIFIED_DEVICE_MODEL') protected model: Repository<UserVerifiedDevice>,
    ) { super(model); }

    create(body: ICreateVerifiedDevice, transaction?: Transaction): Promise<UserVerifiedDevice> {
        return this.model.create(body as any, { transaction });
    }
}

