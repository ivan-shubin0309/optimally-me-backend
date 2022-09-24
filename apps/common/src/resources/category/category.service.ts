import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Category } from '../../../../biomarkers/src/models';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_MODEL') private readonly categoryModel: Repository<Category>
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