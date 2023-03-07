import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Hl7Object } from './models/hl7-object.entity';

@Injectable()
export class Hl7Service extends BaseService<Hl7Object> {
    constructor(
        @Inject('HL7_OBJECT_MODEL') protected readonly model: Repository<Hl7Object>
    ) { super(model); }
}
