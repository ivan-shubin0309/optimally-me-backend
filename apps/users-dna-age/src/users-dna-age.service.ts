import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/src/base/base.service';
import { DnaAgeResult } from '../../dna-age/src/models/dna-age-result.entity';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class UsersDnaAgeService extends BaseService<DnaAgeResult> {
    constructor(
        @Inject('DNA_AGE_RESULT_MODEL') protected readonly model: Repository<DnaAgeResult>,
    ) { super(model); }
}
