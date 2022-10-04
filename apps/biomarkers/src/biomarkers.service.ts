import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Biomarker } from './models/biomarker.entity';
import { BiomarkersFactory } from './biomarkers.factory';
import { CreateBiomarkerDto } from './models/create-biomarker.dto';
import { Filter } from './models/filters/filter.entity';
import { AlternativeName } from './models/alternativeNames/alternative-name.entity';
import { TranslatorService } from 'nestjs-translator';
import { Unit } from './models/units/unit.entity';
import { Category } from './models/categories/category.entity';
import { Recommendation } from './models/recommendations/recommendation.entity';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';

@Injectable()
export class BiomarkersService extends BaseService<Biomarker> {
    constructor(
        @Inject('BIOMARKER_MODEL') protected model: Repository<Biomarker>,
        readonly biomarkersFactory: BiomarkersFactory,
        @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
        @Inject('FILTER_MODEL') readonly filterModel: Repository<Filter>,
        @Inject('ALTERNATIVE_NAME_MODEL') readonly alternativeNameModel: Repository<AlternativeName>,
        readonly translator: TranslatorService,
        @Inject('UNIT_MODEL') readonly unitModel: Repository<Unit>,
        @Inject('CATEGORY_MODEL') readonly categoryModel: Repository<Category>,
        @Inject('RECOMMENDATION_MODEL') readonly recommendationModel: Repository<Recommendation>,
    ) { super(model); }

    async create(body: CreateBiomarkerDto): Promise<Biomarker> {
        return this.dbConnection.transaction(transaction => {
            return this.biomarkersFactory.createBiomarker(body, transaction);
        });
    }

    async update(biomarker: Biomarker, body: CreateBiomarkerDto): Promise<Biomarker> {
        return this.dbConnection.transaction(async transaction => {
            const scopes: any[] = [{ method: ['byBiomarkerId', biomarker.id] }];

            await Promise.all([
                this.alternativeNameModel.scope(scopes).destroy({ transaction }),
                this.filterModel.scope(scopes).destroy({ transaction }),
            ]);

            await biomarker.update(body, { transaction });

            const promises = body.filters.map(filter => this.biomarkersFactory.attachFilter(filter, biomarker.id, transaction));

            if (body.alternativeNames && body.alternativeNames.length) {
                promises.push(this.biomarkersFactory.attachAlternativeNames(body.alternativeNames, biomarker.id, transaction));
            }

            await Promise.all(promises);

            return this.getOne(
                [{ method: ['byId', biomarker.id] }, 'includeAll'],
                transaction
            );
        });
    }

    async validateBody(body: CreateBiomarkerDto): Promise<void> {
        if (body.ruleId) {
            const templateBiomarker = await this.getOne([
                { method: ['byId', body.ruleId] },
                { method: ['byType', BiomarkerTypes.rule] },
                { method: ['byIsDeleted', false] }
            ]);
            if (!templateBiomarker) {
                throw new BadRequestException({
                    message: this.translator.translate('RULE_NOT_FOUND'),
                    errorCode: 'RULE_NOT_FOUND',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }
        }

        const unitInstance = await this.unitModel
            .scope([{ method: ['byId', body.unitId] }])
            .findOne();
        if (!unitInstance) {
            throw new BadRequestException({
                message: this.translator.translate('UNIT_NOT_FOUND'),
                errorCode: 'UNIT_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        const categoryInstance = await this.categoryModel
            .scope([{ method: ['byId', body.categoryId] }])
            .findOne();
        if (!categoryInstance) {
            throw new BadRequestException({
                message: this.translator.translate('CATEGORY_NOT_FOUND'),
                errorCode: 'CATEGORY_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        if (body.filters && body.filters.length) {
            const recommendationIdsMap = {};

            body.filters.forEach(filter => {
                if (filter.recommendation) {
                    const recommendation = filter.recommendation;

                    if (recommendation.criticalLow && recommendation.criticalLow.length) {
                        recommendation.criticalLow.forEach(criticalLow => { recommendationIdsMap[criticalLow.recommendationId] = true; });
                    }
                    if (recommendation.low && recommendation.low.length) {
                        recommendation.low.forEach(low => { recommendationIdsMap[low.recommendationId] = true; });
                    }
                    if (recommendation.high && recommendation.high.length) {
                        recommendation.high.forEach(high => { recommendationIdsMap[high.recommendationId] = true; });
                    }
                    if (recommendation.criticalHigh && recommendation.criticalHigh.length) {
                        recommendation.criticalHigh.forEach(criticalHigh => { recommendationIdsMap[criticalHigh.recommendationId]; });
                    }
                }
            });

            const recommendationIds = Object.keys(recommendationIdsMap);
            const recommendationsCount = await this.recommendationModel
                .scope([{ method: ['byId', recommendationIds] }])
                .count();

            if (recommendationsCount !== recommendationIds.length) {
                throw new BadRequestException({
                    message: this.translator.translate('RECOMMENDATION_NOT_FOUND'),
                    errorCode: 'RECOMMENDATION_NOT_FOUND',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }
        }
    }
}

