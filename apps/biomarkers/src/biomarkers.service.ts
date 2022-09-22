import { Inject, Injectable } from '@nestjs/common';
import { Categories } from './models';

@Injectable()
export class BiomarkersService {
  constructor(
    @Inject('CATEGORIES_MODEL') private readonly categoriesModel: typeof Categories,
  ) {}


  getListCategories():  Promise<Categories[]> {
    return this.categoriesModel.findAll();
  }
}
