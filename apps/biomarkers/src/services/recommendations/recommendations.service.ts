import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../../../common/src/base/base.service';
import { Repository, Sequelize } from 'sequelize-typescript';
import { CreateRecommendationDto } from '../../models/recommendations/create-recommendation.dto';
import { Recommendation } from '../../models/recommendations/recommendation.entity';
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
import { ImpactStudyLinkTypes } from '../../../../common/src/resources/recommendation-impacts/impact-study-link-types';
import { RecommendationSkinType } from '../../models/recommendationSkinTypes/recommendation-skin-type.entity';
import { RecommendationContradiction } from '../../models/recommendationContradictions/recommendation-contradiction.entity';
import { RecommendationTag } from '../../models/recommendationTags/recommendation-tag.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class RecommendationsService extends BaseService<Recommendation> {
  constructor(
    @Inject('RECOMMENDATION_MODEL') protected model: Repository<Recommendation>,
    @Inject('RECOMMENDATION_FILE_MODEL') readonly recommendationFileModel: Repository<RecommendationFile>,
    @Inject('RECOMMENDATION_IMPACT_MODEL') readonly recommendationImpactModel: Repository<RecommendationImpact>,
    @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
    @Inject('IMPACT_STUDY_LINK_MODEL') readonly impactStudyLinkModel: Repository<ImpactStudyLink>,
    @Inject('RECOMMENDATION_SKIN_TYPE_MODEL') readonly recommendationSkinTypeModel: Repository<RecommendationSkinType>,
    @Inject('RECOMMENDATION_CONTRADICTION_MODEL') readonly recommendationContradictionModel: Repository<RecommendationContradiction>,
    readonly filesService: FilesService,
    @Inject('RECOMMENDATION_TAG_MODEL') readonly recommendationTagModel: Repository<RecommendationTag>,
  ) { super(model); }

  async create(body: CreateRecommendationDto, user: SessionDataDto): Promise<Recommendation> {
    const file = await this.filesService.checkCanUse(body.fileId, FileTypes.recommendation, null, false);

    const createdRecommendation = await this.dbConnection.transaction(async transaction => {
      const recommendation = await this.model.create(Object.assign({ isDeletable: true }, body) as any, { transaction });

      if (body.fileId) {
        let fileId = body.fileId;
        if (file.isUsed) {
          const [copiedFile] = await this.filesService.duplicateFiles([file.id], user, transaction);
          fileId = copiedFile.id;
        }
        await this.attachFiles([{ recommendationId: recommendation.id, fileId }], transaction);
      }

      await this.attachAll(body, recommendation.id, transaction);

      return recommendation;
    });

    return this.getOne(
      [
        { method: ['byId', createdRecommendation.id] },
        'withFiles',
        'withRecommendationTag'
      ],
      null,
      { isIncludeAll: true }
    );
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
            .scope([{ method: ['byRecommendationId', recommendation.id] }])
            .destroy({ transaction }),
        );
      }

      if (recommendation.skinTypes && recommendation.skinTypes.length) {
        deletePromises.push(
          this.recommendationSkinTypeModel
            .scope([{ method: ['byRecommendationId', recommendation.id] }])
            .destroy({ transaction }),
        );
      }

      if (recommendation.contradictions && recommendation.contradictions.length) {
        deletePromises.push(
          this.recommendationContradictionModel
            .scope([{ method: ['byRecommendationId', recommendation.id] }])
            .destroy({ transaction }),
        );
      }

      if (recommendation.tag) {
        deletePromises.push(
          this.recommendationTagModel
            .scope([{ method: ['byRecommendationId', recommendation.id] }])
            .destroy({ transaction }),
        );
      }

      await Promise.all(deletePromises);

      const updateBody = new RecommendationDataDto(body);

      await recommendation.update(updateBody, { transaction });

      if (body.fileId) {
        await this.attachFiles([{ recommendationId: recommendation.id, fileId: body.fileId }], transaction);
      }

      await this.attachAll(body, recommendation.id, transaction);
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

  async attachStudyLinksToImpacts(impacts: RecommendationImpact[], body: CreateRecommendationDto, transaction?: Transaction): Promise<void> {
    const studyLinksToCreate = [];

    impacts.forEach((impact, index) => {
      if (body.impacts[index].lowStudyLinks && body.impacts[index].lowStudyLinks.length) {
        body.impacts[index].lowStudyLinks.forEach(studyLink => {
          studyLinksToCreate.push({
            content: studyLink.content,
            recommendationImpactId: impact.id,
            type: ImpactStudyLinkTypes.low,
            title: studyLink.title,
          });
        });
      }
      if (body.impacts[index].highStudyLinks && body.impacts[index].highStudyLinks.length) {
        body.impacts[index].highStudyLinks.forEach(studyLink => {
          studyLinksToCreate.push({
            content: studyLink.content,
            recommendationImpactId: impact.id,
            type: ImpactStudyLinkTypes.high,
            title: studyLink.title,
          });
        });
      }
    });

    await this.impactStudyLinkModel.bulkCreate(studyLinksToCreate, { transaction });
  }

  async getOne(scopes = [], transaction?: Transaction, options?: { isIncludeAll: boolean }): Promise<Recommendation> {
    const recommendation = await this.model
      .scope(scopes)
      .findOne({ transaction });

    if (options?.isIncludeAll && recommendation) {
      const [impacts, skinTypes, contradictions, tag] = await Promise.all([
        this.recommendationImpactModel
          .scope([{ method: ['byRecommendationId', recommendation.id] }, 'withBiomarker', 'withStudyLinks'])
          .findAll({ transaction }),
        this.recommendationSkinTypeModel
          .scope([{ method: ['byRecommendationId', recommendation.id] }])
          .findAll({ transaction }),
        this.recommendationContradictionModel
          .scope([{ method: ['byRecommendationId', recommendation.id] }])
          .findAll({ transaction }),
        this.recommendationTagModel
          .scope([{ method: ['byRecommendationId', recommendation.id] }])
          .findOne({ transaction }),
      ]);

      recommendation.setDataValue('impacts', impacts);
      recommendation.impacts = impacts;
      recommendation.setDataValue('skinTypes', skinTypes);
      recommendation.skinTypes = skinTypes;
      recommendation.setDataValue('contradictions', contradictions);
      recommendation.contradictions = contradictions;
      recommendation.setDataValue('tag', tag);
      recommendation.tag = tag;
    }

    return recommendation;
  }

  async attachAll(body: CreateRecommendationDto, recommendationId: number, transaction?: Transaction): Promise<void> {
    if (body.impacts && body.impacts.length) {
      const impactsToCreate: any[] = body.impacts.map(impact => Object.assign({ recommendationId }, impact));

      const createdImpacts = await this.recommendationImpactModel.bulkCreate(impactsToCreate, { transaction });

      await this.attachStudyLinksToImpacts(createdImpacts, body, transaction);
    }

    if (body.idealSkinTypes && body.idealSkinTypes.length) {
      const skinTypesToCreate: any[] = body.idealSkinTypes.map(idealSkinType => ({ recommendationId, skinType: idealSkinType, isIdealSkinType: true }));

      await this.recommendationSkinTypeModel.bulkCreate(skinTypesToCreate, { transaction });
    }

    if (body.notMeantForSkinTypes && body.notMeantForSkinTypes.length) {
      const skinTypesToCreate: any[] = body.notMeantForSkinTypes.map(notMeantForSkinType => ({ recommendationId, skinType: notMeantForSkinType, isIdealSkinType: false }));

      await this.recommendationSkinTypeModel.bulkCreate(skinTypesToCreate, { transaction });
    }

    if (body.contradictions && body.contradictions.length) {
      const contradictionsToCreate: any[] = body.contradictions.map(contradiction => ({ recommendationId, contradictionType: contradiction }));

      await this.recommendationContradictionModel.bulkCreate(contradictionsToCreate, { transaction });
    }

    if (body.tagName) {
      await this.recommendationTagModel.create({ recommendationId, name: body.tagName }, { transaction });
    }
  }

  async getList(scopes: any[], transaction?: Transaction, options?: { isIncludeAll: boolean }): Promise<Recommendation[]> {
    const recommendationList = await super.getList(scopes, transaction);

    if (!recommendationList.length) {
      return recommendationList;
    }

    if (options?.isIncludeAll) {
      const impactsMap = {}, skinTypesMap = {}, contradictionsMap = {};
      const recommendationIds = recommendationList.map(recommendation => recommendation.id);

      const [impacts, skinTypes, contradictions] = await Promise.all([
        this.recommendationImpactModel
          .scope([{ method: ['byRecommendationId', recommendationIds] }, 'withBiomarker', 'withStudyLinks'])
          .findAll({ transaction }),
        this.recommendationSkinTypeModel
          .scope([{ method: ['byRecommendationId', recommendationIds] }])
          .findAll({ transaction }),
        this.recommendationContradictionModel
          .scope([{ method: ['byRecommendationId', recommendationIds] }])
          .findAll({ transaction }),
      ]);

      impacts.forEach(impact => {
        if (!impactsMap[impact.recommendationId]) {
          impactsMap[impact.recommendationId] = [];
        }
        impactsMap[impact.recommendationId].push(impact);
      });
      skinTypes.forEach(skinType => {
        if (!skinTypesMap[skinType.recommendationId]) {
          skinTypesMap[skinType.recommendationId] = [];
        }
        skinTypesMap[skinType.recommendationId].push(skinType);
      });
      contradictions.forEach(contradiction => {
        if (!contradictionsMap[contradiction.recommendationId]) {
          contradictionsMap[contradiction.recommendationId] = [];
        }
        contradictionsMap[contradiction.recommendationId].push(contradiction);
      });

      recommendationList.forEach(recommendation => {
        recommendation.setDataValue('impacts', impactsMap[recommendation.id]);
        recommendation.impacts = impactsMap[recommendation.id];
        recommendation.setDataValue('skinTypes', skinTypesMap[recommendation.id]);
        recommendation.skinTypes = skinTypesMap[recommendation.id];
        recommendation.setDataValue('contradictions', contradictionsMap[recommendation.id]);
        recommendation.contradictions = contradictionsMap[recommendation.id];
      });
    }

    return recommendationList;
  }

  getTag(scopes: any[], transaction?: Transaction): Promise<RecommendationTag> {
    return this.recommendationTagModel
      .scope(scopes)
      .findOne({ transaction });
  }

  getTags(scopes: any[], transaction?: Transaction): Promise<RecommendationTag[]> {
    return this.recommendationTagModel
      .scope(scopes)
      .findAll({ transaction });
  }
}