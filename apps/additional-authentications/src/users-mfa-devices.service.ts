import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserVerifiedDevice } from './models/user-verified-device.entity';

@Injectable()
export class UsersVerifiedDevicesService extends BaseService<UserVerifiedDevice> {
    constructor(
        @Inject('USER_VERIFIED_DEVICE_MODEL') protected model: Repository<UserVerifiedDevice>,
    ) { super(model); }
}

