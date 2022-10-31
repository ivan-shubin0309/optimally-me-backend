import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../../../common/src/base/base.service';
import { Repository, Sequelize } from 'sequelize-typescript';
import { CreateRecommendationDto } from '../../models/recommendations/create-recommendation.dto';
import { Recommendation } from '../../models/recommendations/recommendation.entity';
import { Transaction } from 'sequelize/types';
import { RecommendationFile } from '../../models/recommendations/recommendation-file.entity';
import { RecommendationImpact } from '../../models/recommendationImpacts/recommendation-impact.entity';
import { RecommendationDataDto } from '../../models/recommendations/recommendation-data.dto';
import { RECOMMENDATION_COPY_TITLE_PREFIX } from '../../../../common/src/resources/recommendations/constants';
import { recommendationValidationRules } from '../../../../common/src/resources/recommendations/recommendation-validation-rules';
import { FilesService } from '../../../../files/src/files.service';
import { SessionDataDto } from '../../../../sessions/src/models';
import { RecommendationImpactDto } from '../../models/recommendationImpacts/recommendation-impact.dto';

@Injectable()
export class RecommendationsService extends BaseService<Recommendation> {
  constructor(
    @Inject('RECOMMENDATION_MODEL') protected model: Repository<Recommendation>,
    @Inject('RECOMMENDATION_FILE_MODEL') readonly recommendationFileModel: Repository<RecommendationFile>,
    @Inject('RECOMMENDATION_IMPACT_MODEL') readonly recommendationImpactModel: Repository<RecommendationImpact>,
    @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
    readonly filesService: FilesService,
  ) { super(model); }

  create(body: CreateRecommendationDto | RecommendationDataDto, transaction?: Transaction) {
    return this.model.create({ ...body }, { transaction });
  }

  async update(recommendation: Recommendation, body: CreateRecommendationDto): Promise<void> {
    await this.dbConnection.transaction(async transaction => {
      const deletePromises = [];

      if (recommendation.files && recommendation.files.length) {
        deletePromises.push(
          this.recommendationFileModel
            .scope([
              { method: ['byFileIdAndRecommendationId', recommendation.files.map(file => ({ fileId: file.id, recommendationId: recommendation.id }))] }
            ])
            .destroy({ transaction })
        );
      }

      if (recommendation.impacts && recommendation.impacts.length) {
        deletePromises.push(
          this.recommendationImpactModel
            .scope([{ method: ['byId', recommendation.impacts.map(impact => impact.id)] }])
            .destroy({ transaction })
        );
      }

      await Promise.all(deletePromises);

      const updateBody = new RecommendationDataDto(body);

      await recommendation.update(updateBody, { transaction });

      if (body.fileId) {
        await this.recommendationFileModel.create({ recommendationId: recommendation.id, fileId: body.fileId }, { transaction });
      }

      if (body.impacts && body.impacts.length) {
        const impactsToCreate: any[] = body.impacts.map(impact => Object.assign({ recommendationId: recommendation.id }, impact));

        await this.recommendationImpactModel.bulkCreate(impactsToCreate, { transaction });
      }
    });
  }

  async copy(recommendation: Recommendation, user: SessionDataDto) {
    const recommendationToCreate = new RecommendationDataDto(recommendation);
    recommendationToCreate.title = `${RECOMMENDATION_COPY_TITLE_PREFIX} ${recommendationToCreate.title}`
      .substring(0, recommendationValidationRules.titleMaxLength)
      .trim();

    await this.dbConnection.transaction(async transaction => {
      const createdRecommendation = await this.create(recommendationToCreate, transaction);

      if (recommendation.files && recommendation.files.length) {
        const createdFiles = await this.filesService.duplicateFiles(recommendation.files.map(file => file.id), user, transaction);

        await this.recommendationFileModel.bulkCreate(
          createdFiles.map(file => ({ fileId: file.id, recommendationId: createdRecommendation.id })),
          { transaction }
        );

        await this.filesService.markFilesAsUsed(createdFiles.map(file => file.id), transaction);
      }

      if (recommendation.impacts && recommendation.impacts.length) {
        const impactsToCreate: any[] = recommendation.impacts.map(impact => {
          const impactToCreate = Object.assign(
            new RecommendationImpactDto(impact),
            {
              recommendationId: createdRecommendation.id,
              id: null,
              createdAt: null,
              updatedAt: null,
            }
          );
          return impactToCreate;
        });

        await this.recommendationImpactModel.bulkCreate(impactsToCreate, { transaction });
      }
    });
  }
}