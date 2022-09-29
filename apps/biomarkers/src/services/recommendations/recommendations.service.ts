import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Recommendation } from '../../models/recommendations/recommendation.entity';

@Injectable()
export class RecommendationsService extends BaseService<Recommendation> {
  constructor(
      @Inject('RECOMMENDATION_MODEL') protected model: Repository<Recommendation>
  ) { super(model); }
}