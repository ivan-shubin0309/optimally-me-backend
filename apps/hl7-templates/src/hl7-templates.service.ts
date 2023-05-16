import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Hl7Template } from './models/hl7-template.entity';

@Injectable()
export class Hl7TemplatesService extends BaseService<Hl7Template> {
    constructor(
        @Inject('HL7_TEMPLATE_MODEL') protected model: Repository<Hl7Template>,
    ) { super(model); }

    create(body: any, transaction?: Transaction): Promise<Hl7Template> {
        return this.model.create(body, { transaction });
    }
}

