import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Transaction } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { AlternativeName } from '../../models/alternativeNames/alternative-name.entity';

@Injectable()
export class AlternativeNamesService extends BaseService<AlternativeName> {
    constructor(
        @Inject('ALTERNATIVE_NAME_MODEL') protected model: Repository<AlternativeName>
    ) { super(model); }

    async removeByBiomarkerId(biomarkerId: number, transaction?: Transaction): Promise<void> {
        await this.model
            .scope([{ method: ['byBiomarkerId', biomarkerId] }])
            .destroy({ transaction });
    }
}