import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Category } from './models';

@Injectable()
export class BiomarkersService {
  constructor(
    @Inject('CATEGORY_MODEL') private readonly categoryModel: Repository<Category>,
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
}
