import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Category, Unit } from './models';

@Injectable()
export class BiomarkersService {
  constructor(
    @Inject('CATEGORY_MODEL') private readonly categoryModel: Repository<Category>,
    @Inject('UNIT_MODEL') private readonly unitModel: Repository<Unit>,
  ) {}


  getListCategories(scopes = []):  Promise<Category[]> {
    return this.categoryModel
      .scope(scopes)
      .findAll();
  }

  getCategoriesCount(scopes = []):  Promise<number> {
    return this.categoryModel
      .scope(scopes)
      .count();
  }

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
