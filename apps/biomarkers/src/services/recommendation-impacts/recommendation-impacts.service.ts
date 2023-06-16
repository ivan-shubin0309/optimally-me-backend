import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { RecommendationImpact } from '../../models/recommendationImpacts/recommendation-impact.entity';
import { CreateRecommendationImpactDto } from '../../models/recommendationImpacts/create-recommendation-impact.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class RecommendationImpactsService extends BaseService<RecommendationImpact> {
    constructor(
        @Inject('RECOMMENDATION_IMPACT_MODEL') protected model: Repository<RecommendationImpact>
    ) { super(model); }

    bulkCreate(impacts: CreateRecommendationImpactDto[], recommendationId: number, transaction?: Transaction): Promise<RecommendationImpact[]> {
        const impactsToCreate: any[] = impacts.map(impact => Object.assign({ recommendationId }, impact));
        return this.model.bulkCreate(impactsToCreate, { transaction });
    }
}