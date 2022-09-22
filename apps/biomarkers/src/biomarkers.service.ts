import { Inject, Injectable } from '@nestjs/common';
import { Category } from './models';

@Injectable()
export class BiomarkersService {
  constructor(
    @Inject('CATEGORY_MODEL') private readonly categoriesModel: typeof Category,
  ) {}


  getListCategories(scopes = []):  Promise<Category[]> {
    return this.categoriesModel
      .scope(scopes)
      .findAll();
  }

  getCategoriesCount(scopes = []):  Promise<number> {
    return this.categoriesModel
      .scope(scopes)
      .count();
  }
}
