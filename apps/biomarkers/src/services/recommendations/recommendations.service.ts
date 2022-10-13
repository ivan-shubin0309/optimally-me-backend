import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { CreateRecommendationDto } from '../../models/recommendations/create-recommendation.dto';
import { Recommendation } from '../../models/recommendations/recommendation.entity';
import { Transaction } from 'sequelize/types';

@Injectable()
export class RecommendationsService extends BaseService<Recommendation> {
  constructor(
      @Inject('RECOMMENDATION_MODEL') protected model: Repository<Recommendation>
  ) { super(model); }

  create(body: CreateRecommendationDto, transaction?: Transaction) {
    return this.model.create({ ...body }, { transaction });
  }
}