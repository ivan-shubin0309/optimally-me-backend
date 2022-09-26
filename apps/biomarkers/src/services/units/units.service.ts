import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Unit } from '../../../../biomarkers/src/models';

@Injectable()
export class UnitsService {
  constructor(
    @Inject('UNIT_MODEL') private readonly unitModel: Repository<Unit>
  ) {}

  getListUnits(scopes = []):  Promise<Unit[]> {
    return this.unitModel
      .scope(scopes)
      .findAll();
  }

  getUnitsCount(scopes = []):  Promise<number> {
    return this.unitModel
      .scope(scopes)
      .count();
  }
}