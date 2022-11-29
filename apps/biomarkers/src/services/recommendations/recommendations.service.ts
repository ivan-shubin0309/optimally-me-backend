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
import { FileTypes } from '../../../../common/src/resources/files/file-types';
import { ImpactStudyLink } from '../../models/recommendationImpacts/impact-study-link.entity';
import { ImpactStudyLinkTypes } from 'apps/common/src/resources/recommendation-impacts/impact-study-link-types';

@Injectable()
export class RecommendationsService extends BaseService<Recommendation> {
  constructor(
    @Inject('RECOMMENDATION_MODEL') protected model: Repository<Recommendation>,
    @Inject('RECOMMENDATION_FILE_MODEL') readonly recommendationFileModel: Repository<RecommendationFile>,
    @Inject('RECOMMENDATION_IMPACT_MODEL') readonly recommendationImpactModel: Repository<RecommendationImpact>,
    @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
    @Inject('IMPACT_STUDY_LINK_MODEL') readonly impactStudyLinkModel: Repository<ImpactStudyLink>,
    readonly filesService: FilesService,
  ) { super(model); }

  async create(body: CreateRecommendationDto, user: SessionDataDto): Promise<Recommendation> {
    const file = await this.filesService.checkCanUse(body.fileId, FileTypes.recommendation, null, false);

    const createdRecommendation = await this.dbConnection.transaction(async transaction => {
      const recommendation = await this.model.create(body as any, { transaction });

      if (body.fileId) {
        let fileId = body.fileId;
        if (file.isUsed) {
          const [copiedFile] = await this.filesService.duplicateFiles([file.id], user, transaction);
          fileId = copiedFile.id;
        }
        await this.attachFiles([{ recommendationId: recommendation.id, fileId }], transaction);
      }

      if (body.impacts && body.impacts.length) {
        const impactsToCreate: any[] = body.impacts.map(impact => Object.assign({ recommendationId: recommendation.id }, impact));

        const createdImpacts = await this.recommendationImpactModel.bulkCreate(impactsToCreate, { transaction });

        const studyLinksToCreate = [];

        createdImpacts.forEach((impact, index) => {
          if (body.impacts[index].lowStudyLinks && body.impacts[index].lowStudyLinks.length) {
            body.impacts[index].lowStudyLinks.forEach(link => {
              studyLinksToCreate.push({
                content: link,
                recommendationImpactId: impact.id,
                type: ImpactStudyLinkTypes.low
              });
            });
          }
          if (body.impacts[index].highStudyLinks && body.impacts[index].highStudyLinks.length) {
            body.impacts[index].highStudyLinks.forEach(link => {
              studyLinksToCreate.push({
                content: link,
                recommendationImpactId: impact.id,
                type: ImpactStudyLinkTypes.high
              });
            });
          }
        });

        await this.impactStudyLinkModel.bulkCreate(studyLinksToCreate, { transaction });
      }

      return recommendation;
    });

    return this.getOne([
      { method: ['byId', createdRecommendation.id] },
      'withFiles',
      { method: ['withImpacts', ['withBiomarker', 'withStudyLinks']] }
    ]);
  }

  async update(recommendation: Recommendation, body: CreateRecommendationDto): Promise<void> {
    await this.dbConnection.transaction(async transaction => {
      const deletePromises = [];

      if (recommendation.files && recommendation.files.length) {
        deletePromises.push(this.dettachFiles(recommendation, transaction));
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
        await this.attachFiles([{ recommendationId: recommendation.id, fileId: body.fileId }], transaction);
      }

      if (body.impacts && body.impacts.length) {
        const impactsToCreate: any[] = body.impacts.map(impact => Object.assign({ recommendationId: recommendation.id }, impact));

        const createdImpacts = await this.recommendationImpactModel.bulkCreate(impactsToCreate, { transaction });

        const studyLinksToCreate = [];

        createdImpacts.forEach((impact, index) => {
          if (body.impacts[index].lowStudyLinks && body.impacts[index].lowStudyLinks.length) {
            body.impacts[index].lowStudyLinks.forEach(link => {
              studyLinksToCreate.push({
                content: link,
                recommendationImpactId: impact.id,
                type: ImpactStudyLinkTypes.low
              });
            });
          }
          if (body.impacts[index].highStudyLinks && body.impacts[index].highStudyLinks.length) {
            body.impacts[index].highStudyLinks.forEach(link => {
              studyLinksToCreate.push({
                content: link,
                recommendationImpactId: impact.id,
                type: ImpactStudyLinkTypes.high
              });
            });
          }
        });

        await this.impactStudyLinkModel.bulkCreate(studyLinksToCreate, { transaction });
      }
    });
  }

  async copy(recommendation: Recommendation, user: SessionDataDto) {
    const recommendationToCreate = new RecommendationDataDto(recommendation);
    recommendationToCreate.title = `${RECOMMENDATION_COPY_TITLE_PREFIX} ${recommendationToCreate.title}`
      .substring(0, recommendationValidationRules.titleMaxLength)
      .trim();

    await this.dbConnection.transaction(async transaction => {
      const createdRecommendation = await this.model.create(recommendationToCreate as any, { transaction });

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

  async attachFiles(files: [{ recommendationId: number, fileId: number }], transaction?: Transaction): Promise<void> {
    await this.recommendationFileModel.bulkCreate(files, { transaction });
    await this.filesService.markFilesAsUsed(files.map(file => file.fileId), transaction);
  }

  async dettachFiles(recommendation: Recommendation, transaction?: Transaction) {
    await this.recommendationFileModel
      .scope([
        { method: ['byFileIdAndRecommendationId', recommendation.files.map(file => ({ fileId: file.id, recommendationId: recommendation.id }))] }
      ])
      .destroy({ transaction });

    await this.filesService.markFilesAsUnused(recommendation.files.map(file => file.id), transaction);
  }
}