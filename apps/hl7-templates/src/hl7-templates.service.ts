import { Inject, Injectable } from '@nestjs/common';
import { DateFilterTypes } from '../../common/src/resources/hl7-templates/date-filter-types';
import { Transaction } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Hl7Template } from './models/hl7-template.entity';
import { Hl7ObjectStatuses } from '../../common/src/resources/hl7/hl7-object-statuses';

interface ICreateHl7Template {
    userId: number;
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
    status?: Hl7ObjectStatuses;
    searchString?: string;
}

@Injectable()
export class Hl7TemplatesService extends BaseService<Hl7Template> {
    constructor(
        @Inject('HL7_TEMPLATE_MODEL') protected model: Repository<Hl7Template>,
    ) { super(model); }

    create(body: ICreateHl7Template, transaction?: Transaction): Promise<Hl7Template> {
        return this.model.create(body as any, { transaction });
    }
}

