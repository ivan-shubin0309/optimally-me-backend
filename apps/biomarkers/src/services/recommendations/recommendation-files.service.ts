import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../../../common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { RecommendationFile } from '../../models/recommendations/recommendation-file.entity';

@Injectable()
export class RecommendationFilesService extends BaseService<RecommendationFile> {
    constructor(
        @Inject('RECOMMENDATION_FILE_MODEL') protected model: Repository<RecommendationFile>
    ) { super(model); }

    create(body: { recommendationId: number, fileId: number }, transaction?: Transaction): Promise<RecommendationFile> {
        return this.model.create({ ...body }, { transaction });
    }
}