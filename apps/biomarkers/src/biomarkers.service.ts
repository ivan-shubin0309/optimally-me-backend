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
import { Transaction } from 'sequelize/types';
import { FiltersService } from './services/filters/filters.service';

interface IBiomarkerGetOneOptions {
    readonly filters?: { isIncludeAll: boolean }
}

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
        private readonly filtersService: FiltersService,
    ) { super(model); }

    async create(body: CreateBiomarkerDto): Promise<Biomarker> {
        const createdBiomarker = await this.dbConnection.transaction(transaction => {
            return this.biomarkersFactory.createBiomarker(body, transaction);
        });

        return this.getOne([{ method: ['byId', createdBiomarker.id] }], null, { filters: { isIncludeAll: true } });
    }

    async update(biomarker: Biomarker, body: CreateBiomarkerDto): Promise<Biomarker> {
        const biomarkerId = await this.dbConnection.transaction(async transaction => {
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

            return biomarker.id;
        });

        return this.getOne([{ method: ['byId', biomarkerId] }], null, { filters: { isIncludeAll: true } });
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
                if (filter.recommendations && filter.recommendations.length) {
                    filter.recommendations.forEach(recommendation => { recommendationIdsMap[recommendation.recommendationId] = true; });
                }
            });

            const recommendationIds = Object.keys(recommendationIdsMap);

            if (recommendationIds.length) {
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

    async getOne(scopes: any[], transaction?: Transaction, options: IBiomarkerGetOneOptions = {}): Promise<Biomarker> {
        const biomarker = await super.getOne(scopes, transaction);

        if (options.filters) {
            const filterScopes: any[] = [{ method: ['byBiomarkerId', biomarker.id] }];

            const filters = await this.filtersService.getList(filterScopes, transaction, { isIncludeAll: options.filters.isIncludeAll });

            biomarker.setDataValue('filters', filters);
            biomarker.filters = filters;
        }

        return biomarker;
    }
}

