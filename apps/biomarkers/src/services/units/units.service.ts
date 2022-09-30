import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Unit } from '../../models/units/unit.entity';

@Injectable()
export class UnitsService extends BaseService<Unit> {
  constructor(
    @Inject('UNIT_MODEL') protected model: Repository<Unit>
  ) { super(model); }
}