import { Inject, Injectable } from '@nestjs/common';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { Biomarker } from './models/biomarker.entity';
import { CreateBiomarkerDto } from './models/create-biomarker.dto';
import { CreateFilterDto } from './models/filters/create-filter.dto';
import { Filter } from './models/filters/filter.entity';
import { CreateInteractionDto } from './models/interactions/create-interaction.dto';
import { Interaction } from './models/interactions/interaction.entity';
import { AddRecommendationDto } from './models/recommendations/add-recommendation.dto';
import { FilterRecommendation } from './models/recommendations/filter-recommendation.entity';
import { FilterSex } from './models/filtersSex/filter-sex.entity';
import { FilterAge } from './models/filtersAge/filter-age.entity';
import { FilterEthnicity } from './models/filterEthnicity/filter-ethnicity.entity';
import { FilterOtherFeature } from './models/filterOtherFeatures/filter-other-feature.entity';
import { AlternativeName } from './models/alternativeNames/alternative-name.entity';
import { CreateFilterGroupDto } from './models/filterGroups/create-filter-group.dto';
import { FilterGroup } from './models/filterGroups/filter-group.entity';
import { CreateFilterSummaryDto } from './models/filterSummaries/create-filter-summary.dto';
import { FilterSummary } from './models/filterSummaries/filter-summary.entity';
import { CreateFilterBulletListDto } from './models/filterBulletLists/create-filter-bullet-list.dto';
import { FilterBulletList } from './models/filterBulletLists/filter-bullet-list.entity';
import { StudyLink } from './models/filterBulletLists/study-link.entity';
import { BulletListCategories } from '../../common/src/resources/filterBulletLists/bullet-list-types';
import { BiomarkerHelper } from '../../common/src/resources/biomarkers/biomarker-helper';

@Injectable()
export class BiomarkersFactory {
    constructor(
        @Inject('BIOMARKER_MODEL') readonly biomarkerModel: Repository<Biomarker>,
        @Inject('FILTER_MODEL') readonly filterModel: Repository<Filter>,
        @Inject('FILTER_RECOMMENDATION_MODEL') readonly filterRecommendationModel: Repository<FilterRecommendation>,
        @Inject('INTERACTION_MODEL') readonly interactionModel: Repository<Interaction>,
        @Inject('FILTER_SEX_MODEL') readonly filterSexModel: Repository<FilterSex>,
        @Inject('FILTER_AGE_MODEL') readonly filterAgeModel: Repository<FilterAge>,
        @Inject('FILTER_ETHNICITY_MODEL') readonly filterEthnicityModel: Repository<FilterEthnicity>,
        @Inject('FILTER_OTHER_FEATURE_MODEL') readonly filterOtherFeatureModel: Repository<FilterOtherFeature>,
        @Inject('ALTERNATIVE_NAME_MODEL') readonly alternativeNameModel: Repository<AlternativeName>,
        @Inject('FILTER_GROUP_MODEL') readonly filterGroupModel: Repository<FilterGroup>,
        @Inject('FILTER_SUMMARY_MODEL') readonly filterSummaryModel: Repository<FilterSummary>,
        @Inject('FILTER_BULLET_LIST_MODEL') readonly filterBulletListModel: Repository<FilterBulletList>,
        @Inject('STUDY_LINK_MODEL') readonly studyLinkModel: Repository<StudyLink>,
    ) { }

    private async create(body: CreateBiomarkerDto & { templateId?: number, type: BiomarkerTypes }, transaction?: Transaction): Promise<Biomarker> {
        const biomarkerToCreate: any = body;
        const createdBiomarker = await this.biomarkerModel.create(biomarkerToCreate, { transaction });

        if (!body.filters || (body.filters && !body.filters.length)) {
            return createdBiomarker;
        }

        const promises = body.filters.map(filter => this.attachFilter(filter, createdBiomarker.id, transaction));

        if (body.alternativeNames && body.alternativeNames.length) {
            promises.push(this.attachAlternativeNames(body.alternativeNames, createdBiomarker.id, transaction));
        }

        await Promise.all(promises);

        return createdBiomarker;
    }

    async createBiomarker(body: CreateBiomarkerDto, transaction?: Transaction): Promise<Biomarker> {
        let templateId;
        if (body.ruleName) {
            const rule = await this.createRule(body, transaction);
            templateId = rule.id;
        } else {
            templateId = body.ruleId;
        }

        const sex = BiomarkerHelper.getBiomarkerSex(body);

        return this.create(Object.assign({ type: BiomarkerTypes.biomarker, templateId, sex }, body), transaction);
    }

    async createRule(body: CreateBiomarkerDto, transaction?: Transaction): Promise<Biomarker> {
        const ruleToCreate = Object.assign(
            {},
            body,
            { type: BiomarkerTypes.rule, name: body.ruleName, label: null, shortName: null }
        );
        return this.create(ruleToCreate, transaction);
    }

    async attachFilter(filter: CreateFilterDto, biomarkerId: number, transaction?: Transaction): Promise<void> {
        const filterToCreate: any = Object.assign(
            { biomarkerId },
            filter,
            {
                whatAreTheRisksLow: filter.whatAreTheRisks?.low,
                whatAreTheRisksHigh: filter.whatAreTheRisks?.high,
                whatAreTheCausesLow: filter.whatAreTheCauses?.low,
                whatAreTheCausesHigh: filter.whatAreTheCauses?.high,
            }
        );
        const createdFilter = await this.filterModel.create(filterToCreate, { transaction });

        await this.attachToFilterAll(filter, createdFilter.id, transaction);
    }

    async attachToFilterAll(filter: CreateFilterDto, filterId: number, transaction?: Transaction) {
        const promises = [this.attachFilterCharacteristics(filter, filterId, transaction)];

        if (filter.recommendations) {
            promises.push(this.attachRecommendationsToFilter(filter.recommendations, filterId, transaction));
        }

        if (filter.interactions) {
            promises.push(this.attachInteractionsToFilter(filter.interactions, filterId, transaction));
        }

        if (filter.groups) {
            promises.push(this.attachGroupsToFilter(filter.groups, filterId, transaction));
        }

        if (filter.resultSummary) {
            promises.push(this.attachSummaryToFilter(filter.resultSummary, filterId, transaction));
        }

        if (filter.whatAreTheRisks && filter.whatAreTheRisks.bulletList) {
            promises.push(this.attachBulletListToFilter(filter.whatAreTheRisks.bulletList, filterId, BulletListCategories.risks, transaction));
        }

        if (filter.whatAreTheCauses && filter.whatAreTheCauses.bulletList) {
            promises.push(this.attachBulletListToFilter(filter.whatAreTheCauses.bulletList, filterId, BulletListCategories.causes, transaction));
        }

        await Promise.all(promises);
    }

    private async attachRecommendationsToFilter(recommendations: AddRecommendationDto[], filterId: number, transaction?: Transaction): Promise<void> {
        const recommendationsToCreate: any[] = recommendations.map(recommendation => Object.assign({ filterId }, recommendation));
        await this.filterRecommendationModel.bulkCreate(recommendationsToCreate, { transaction });
    }

    private async attachInteractionsToFilter(interactions: CreateInteractionDto[], filterId: number, transaction?: Transaction): Promise<void> {
        const interactionsToCreate: any[] = interactions.map(interaction => Object.assign({ filterId }, interaction));
        await this.interactionModel.bulkCreate(interactionsToCreate, { transaction });
    }

    private async attachFilterCharacteristics(filter: CreateFilterDto, filterId: number, transaction?: Transaction): Promise<void> {
        const promises = [];
        if (filter.ages && filter.ages.length) {
            const agesToCreate: any[] = filter.ages.map(age => ({ filterId, age }));

            promises.push(
                this.filterAgeModel.bulkCreate(agesToCreate, { transaction })
            );
        }
        if (filter.sexes && filter.sexes.length) {
            const sexesToCreate: any[] = filter.sexes.map(sex => ({ filterId, sex }));

            promises.push(
                this.filterSexModel.bulkCreate(sexesToCreate, { transaction })
            );
        }
        if (filter.ethnicities && filter.ethnicities.length) {
            const ethnicitiesToCreate: any[] = filter.ethnicities.map(ethnicity => ({ filterId, ethnicity }));

            promises.push(
                this.filterEthnicityModel.bulkCreate(ethnicitiesToCreate, { transaction })
            );
        }
        if (filter.otherFeatures && filter.otherFeatures.length) {
            const otherFeaturesToCreate: any[] = filter.otherFeatures.map(otherFeature => ({ filterId, otherFeature }));

            promises.push(
                this.filterOtherFeatureModel.bulkCreate(otherFeaturesToCreate, { transaction })
            );
        }

        await Promise.all(promises);
    }

    async attachAlternativeNames(alternativeNames: string[], biomarkerId: number, transaction?: Transaction): Promise<void> {
        await this.alternativeNameModel.bulkCreate(alternativeNames.map(alternativeName => ({ biomarkerId, name: alternativeName })), { transaction });
    }

    async attachGroupsToFilter(groups: CreateFilterGroupDto[], filterId: number, transaction?: Transaction): Promise<void> {
        const groupsToCreate = [];
        groups.forEach(group => {
            group.recommendationTypes.forEach(recommendationType => {
                groupsToCreate.push({ filterId, recommendationType, type: group.type });
            });
        });
        await this.filterGroupModel.bulkCreate(groupsToCreate, { transaction });
    }

    async attachSummaryToFilter(summary: CreateFilterSummaryDto, filterId: number, transaction?: Transaction): Promise<void> {
        const filterSummaryToCreate: any = Object.assign({ filterId }, summary);
        await this.filterSummaryModel.create(filterSummaryToCreate, { transaction });
    }

    async attachBulletListToFilter(bulletList: CreateFilterBulletListDto[], filterId: number, category: BulletListCategories, transaction?: Transaction): Promise<void> {
        const createdBulletList = await this.filterBulletListModel.bulkCreate(bulletList.map(bullet => Object.assign({ filterId, category }, bullet) as any), { transaction });
        const studyLinksToCreate = [];

        bulletList.forEach((bullet, index) => {
            if (bullet.studyLinks && bullet.studyLinks.length) {
                const studyLinksData = bullet.studyLinks.map(link => ({ filterBulletListId: createdBulletList[index].id, content: link }));
                studyLinksToCreate.push(...studyLinksData);
            }
        });

        await this.studyLinkModel.bulkCreate(studyLinksToCreate, { transaction });
    }
}