import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Hl7ErrorNotification } from './models/hl7-error-notification.entity';
import { Transaction } from 'sequelize';

interface ICreateHl7ErrorNotification {
    readonly hl7ObjectId: number;
    readonly message: string;
}

@Injectable()
export class Hl7ErrorNotificationsService extends BaseService<Hl7ErrorNotification> {
    constructor(
        @Inject('HL7_ERROR_NOTIFICATION_MODEL') protected readonly model: Repository<Hl7ErrorNotification>
    ) { super(model); }

    create(body: ICreateHl7ErrorNotification, transaction?: Transaction): Promise<Hl7ErrorNotification> {
        return this.model.create(body as any, { transaction });
    }

    async resolveAllErrors(hl7ObjectId: number, transaction?: Transaction): Promise<void> {
        await this.model
            .scope([{ method: ['byHl7ObjectId', hl7ObjectId] }])
            .update({ isResolved: true }, { transaction } as any);
    }

    bulkCreate(body: ICreateHl7ErrorNotification[], transaction?: Transaction): Promise<Hl7ErrorNotification[]> {
        return this.model.bulkCreate(body as any[], { transaction });
    }
}
