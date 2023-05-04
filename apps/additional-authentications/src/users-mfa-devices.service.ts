import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { UserMfaDevice } from './models/user-mfa-device.entity';

@Injectable()
export class UsersMfaDevicesService extends BaseService<UserMfaDevice> {
    constructor(
        @Inject('USER_MFA_DEVICE_MODEL') protected model: Repository<UserMfaDevice>,
    ) { super(model); }
}

