import { Inject, Injectable } from '@nestjs/common';
import { DateFilterTypes } from '../../common/src/resources/hl7-templates/date-filter-types';
import { Transaction } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Hl7Template } from './models/hl7-template.entity';
import { Hl7ObjectStatuses } from '../../common/src/resources/hl7/hl7-object-statuses';
import { Hl7TemplateStatus } from './models/hl7-template-status.entity';

interface ICreateHl7Template {
    userId?: number;
    isPrivate: boolean;
    name: string;
    dateOfBirthStart?: Date | any;
    dateOfBirthEnd?: Date | any;
    activatedAtStartDate?: Date | any;
    activatedAtEndDate?: Date | any;
    activatedAtFilterType?: DateFilterTypes;
    sampleAtStartDate?: Date | any;
    sampleAtEndDate?: Date | any;
    sampleAtFilterType?: DateFilterTypes;
    labReceivedAtStartDate?: Date | any;
    labReceivedAtEndDate?: Date | any;
    labReceivedAtFilterType?: DateFilterTypes;
    resultAtStartDate?: Date | any;
    resultAtEndDate?: Date | any;
    resultAtFilterType?: DateFilterTypes;
    status?: Hl7ObjectStatuses[];
    searchString?: string;
    activatedAtDaysCount?: number;
    sampleAtDaysCount?: number;
    labReceivedAtDaysCount?: number;
    resultAtDaysCount?: number;
}

@Injectable()
export class Hl7TemplatesService extends BaseService<Hl7Template> {
    constructor(
        @Inject('HL7_TEMPLATE_MODEL') protected model: Repository<Hl7Template>,
        @Inject('HL7_TEMPLATE_STATUS_MODEL') protected hl7TemplateStatusModel: Repository<Hl7TemplateStatus>,
    ) { super(model); }

    async create(body: ICreateHl7Template, transaction?: Transaction): Promise<Hl7Template> {
        const createdTemplate = await this.model.create(body as any, { transaction });

        if (body.status && body.status.length) {
            const statusesToCreate = body.status.map(status => ({ status, hl7TemplateId: createdTemplate.id }));
            const templateStatuses = await this.hl7TemplateStatusModel.bulkCreate(statusesToCreate, { transaction });
            createdTemplate.setDataValue('statuses', templateStatuses);
            createdTemplate.statuses = templateStatuses;
        }

        return createdTemplate;
    }

    async update(template: Hl7Template, body: ICreateHl7Template, transaction?: Transaction): Promise<Hl7Template> {
        await template.update(body, { transaction });

        await this.hl7TemplateStatusModel
            .scope({ method: ['byHl7TemplateId', template.id] })
            .destroy({ transaction });

        if (body.status && body.status.length) {
            const statusesToCreate = body.status.map(status => ({ status, hl7TemplateId: template.id }));
            await this.hl7TemplateStatusModel.bulkCreate(statusesToCreate, { transaction });
        }

        return this.getOne([
            { method: ['byId', template.id] },
            { method: ['withStatuses'] }
        ]);
    }
}

