import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Category } from '../../models/categories/category.entity';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @Inject('CATEGORY_MODEL') protected model: Repository<Category>
  ) { super(model); }
}