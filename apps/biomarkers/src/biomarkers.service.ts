import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { BaseService } from '../../common/src/base/base.service';
import { Biomarker } from './models/biomarker.entity';
import { BloodBiomarkersFactory } from './blood-biomarkers.factory';
import { CreateBloodBiomarkerDto } from './models/create-blood-biomarker.dto';
import { Filter } from './models/filters/filter.entity';
import { AlternativeName } from './models/alternativeNames/alternative-name.entity';
import { TranslatorService } from 'nestjs-translator';
import { Unit } from './models/units/unit.entity';
import { Category } from './models/categories/category.entity';
import { Recommendation } from './models/recommendations/recommendation.entity';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { Transaction } from 'sequelize/types';
import { FiltersService } from './services/filters/filters.service';
import { UpdateBiomarkerDto } from './models/update-biomarker.dto';
import { BiomarkerHelper } from '../../common/src/resources/biomarkers/biomarker-helper';
import { UpdateBloodBiomarkerDto } from './models/update-blood-biomarker.dto';
import { CreateSkinBiomarkerDto } from './models/create-skin-biomarker.dto';
import { SkinBiomarkersFactory } from './skin-biomarkers.factory';
import { ICreateBiomarker } from './models/create-biomarker.interface';
import { UpdateSkinBiomarkerDto } from './models/update-skin-biomarker.dto';

interface IBiomarkerGetOneOptions {
    readonly filters?: { isIncludeAll: boolean }
}

@Injectable()
export class BiomarkersService extends BaseService<Biomarker> {
    constructor(
        @Inject('BIOMARKER_MODEL') protected model: Repository<Biomarker>,
        readonly bloodBiomarkersFactory: BloodBiomarkersFactory,
        @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
        @Inject('FILTER_MODEL') readonly filterModel: Repository<Filter>,
        @Inject('ALTERNATIVE_NAME_MODEL') readonly alternativeNameModel: Repository<AlternativeName>,
        readonly translator: TranslatorService,
        @Inject('UNIT_MODEL') readonly unitModel: Repository<Unit>,
        @Inject('CATEGORY_MODEL') readonly categoryModel: Repository<Category>,
        @Inject('RECOMMENDATION_MODEL') readonly recommendationModel: Repository<Recommendation>,
        private readonly filtersService: FiltersService,
        private readonly skinBiomarkersFactory: SkinBiomarkersFactory,
    ) { super(model); }

    async createBloodBiomarker(body: CreateBloodBiomarkerDto): Promise<Biomarker> {
        const createdBiomarker = await this.dbConnection.transaction(transaction => {
            return this.bloodBiomarkersFactory.createBiomarker(body, transaction);
        });

        return this.getOne(
            [
                { method: ['byId', createdBiomarker.id] },
                'withCategory',
                'withUnit',
                'withAlternativeNames',
                'withRule',
            ],
            null,
            { filters: { isIncludeAll: true } }
        );
    }

    async updateBloodBiomarker(biomarker: Biomarker, body: UpdateBloodBiomarkerDto): Promise<Biomarker> {
        const biomarkerId = await this.dbConnection.transaction(async transaction => {
            const scopes: any[] = [{ method: ['byBiomarkerId', biomarker.id] }];

            const biomarkerUpdateBody = new UpdateBiomarkerDto(body);

            biomarkerUpdateBody.sex = BiomarkerHelper.getBiomarkerSex(body);

            await this.alternativeNameModel.scope(scopes).destroy({ transaction });

            if (body.ruleName) {
                const rule = await this.bloodBiomarkersFactory.createRule(body, transaction);
                biomarkerUpdateBody.templateId = rule.id;
            }

            await biomarker.update(biomarkerUpdateBody, { transaction });

            if (body.alternativeNames && body.alternativeNames.length) {
                await this.bloodBiomarkersFactory.attachAlternativeNames(body.alternativeNames, biomarker.id, transaction);
            }

            await this.filtersService.update(body.filters, biomarker.id, this.bloodBiomarkersFactory, transaction);

            return biomarker.id;
        });

        return this.getOne(
            [
                { method: ['byId', biomarkerId] },
                'withCategory',
                'withUnit',
                'withAlternativeNames',
                'withRule',
            ],
            null,
            { filters: { isIncludeAll: true } }
        );
    }

    async validateBody(body: ICreateBiomarker, ruleType: BiomarkerTypes): Promise<void> {
        if (body.ruleId) {
            const templateBiomarker = await this.getOne([
                { method: ['byId', body.ruleId] },
                { method: ['byType', ruleType] },
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

        if (body.ruleName) {
            const templateBiomarker = await this.getOne([
                { method: ['byName', body.ruleName] },
                { method: ['byType', ruleType] },
                { method: ['byIsDeleted', false] }
            ]);
            if (templateBiomarker) {
                throw new BadRequestException({
                    message: this.translator.translate('RULE_ALREADY_EXIST'),
                    errorCode: 'RULE_ALREADY_EXIST',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }
        }

        if (body.unitId) {
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

        if (ruleType === BiomarkerTypes.bloodRule && categoryInstance.name === 'Skin') {
            throw new BadRequestException({
                message: this.translator.translate('CATEGORY_NOT_ALLOWED'),
                errorCode: 'CATEGORY_NOT_ALLOWED',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        if (ruleType === BiomarkerTypes.skinRule && categoryInstance.name !== 'Skin') {
            throw new BadRequestException({
                message: this.translator.translate('CATEGORY_NOT_ALLOWED'),
                errorCode: 'CATEGORY_NOT_ALLOWED',
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

        if (biomarker && options.filters) {
            const filterScopes: any[] = [{ method: ['byBiomarkerId', biomarker.id] }];

            const filters = await this.filtersService.getList(filterScopes, transaction, { isIncludeAll: options.filters.isIncludeAll });

            biomarker.setDataValue('filters', filters);
            biomarker.filters = filters;
        }

        return biomarker;
    }

    async createSkinBiomarker(body: CreateSkinBiomarkerDto): Promise<Biomarker> {
        const createdBiomarker = await this.dbConnection.transaction(transaction => {
            return this.skinBiomarkersFactory.createBiomarker(body, transaction);
        });

        return this.getOne(
            [
                { method: ['byId', createdBiomarker.id] },
                'withCategory',
                'withUnit',
                'withAlternativeNames',
                'withRule',
            ],
            null,
            { filters: { isIncludeAll: true } }
        );
    }

    async updateSkinBiomarker(biomarker: Biomarker, body: UpdateSkinBiomarkerDto): Promise<Biomarker> {
        const biomarkerId = await this.dbConnection.transaction(async transaction => {
            const scopes: any[] = [{ method: ['byBiomarkerId', biomarker.id] }];

            const biomarkerUpdateBody = new UpdateBiomarkerDto(body);

            await this.alternativeNameModel.scope(scopes).destroy({ transaction });

            if (body.ruleName) {
                const rule = await this.skinBiomarkersFactory.createRule(body, transaction);
                biomarkerUpdateBody.templateId = rule.id;
            }

            await biomarker.update(biomarkerUpdateBody, { transaction });

            if (body.alternativeNames && body.alternativeNames.length) {
                await this.bloodBiomarkersFactory.attachAlternativeNames(body.alternativeNames, biomarker.id, transaction);
            }

            await this.filtersService.update(body.filters, biomarker.id, this.skinBiomarkersFactory, transaction);

            return biomarker.id;
        });

        return this.getOne(
            [
                { method: ['byId', biomarkerId] },
                'withCategory',
                'withRule',
            ],
            null,
            { filters: { isIncludeAll: true } }
        );
    }
}

