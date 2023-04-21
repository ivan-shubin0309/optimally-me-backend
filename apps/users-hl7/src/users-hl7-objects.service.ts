import { Inject, Injectable } from '@nestjs/common';
import { Hl7Object } from '../../hl7/src/models/hl7-object.entity';
import { Repository } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';

@Injectable()
export class UsersHl7ObjectsService extends BaseService<Hl7Object> {
    constructor(
        @Inject('HL7_OBJECT_MODEL') protected readonly model: Repository<Hl7Object>,
    ) { super(model); }
}
