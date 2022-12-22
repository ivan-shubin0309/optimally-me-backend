import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { UserHautAiField } from './models/user-haut-ai-field.entity';

@Injectable()
export class UserHautAiFieldsService extends BaseService<UserHautAiField> {
    constructor(
        @Inject('USER_HAUT_AI_FIELD_MODEL') protected model: Repository<UserHautAiField>,
    ) { super(model); }
}