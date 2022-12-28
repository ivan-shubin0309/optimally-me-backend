import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { Biomarker } from './models/biomarker.entity';
import { Filter } from './models/filters/filter.entity';
import { Interaction } from './models/interactions/interaction.entity';
import { FilterRecommendation } from './models/recommendations/filter-recommendation.entity';
import { FilterSex } from './models/filtersSex/filter-sex.entity';
import { FilterAge } from './models/filtersAge/filter-age.entity';
import { FilterEthnicity } from './models/filterEthnicity/filter-ethnicity.entity';
import { FilterOtherFeature } from './models/filterOtherFeatures/filter-other-feature.entity';
import { AlternativeName } from './models/alternativeNames/alternative-name.entity';
import { FilterGroup } from './models/filterGroups/filter-group.entity';
import { FilterSummary } from './models/filterSummaries/filter-summary.entity';
import { FilterBulletList } from './models/filterBulletLists/filter-bullet-list.entity';
import { StudyLink } from './models/filterBulletLists/study-link.entity';
import { BulletListCategories } from '../../common/src/resources/filterBulletLists/bullet-list-types';
import { IAddRecommendation, ICreateBiomarker, ICreateFilter, ICreateFilterBulletList, ICreateFilterGroup, ICreateInteraction, ICreateResultSummary } from './models/create-biomarker.interface';

export abstract class BiomarkersFactory {
    constructor(
        readonly biomarkerModel: Repository<Biomarker>,
        readonly filterModel: Repository<Filter>,
        readonly filterRecommendationModel: Repository<FilterRecommendation>,
        readonly interactionModel: Repository<Interaction>,
        readonly filterSexModel: Repository<FilterSex>,
        readonly filterAgeModel: Repository<FilterAge>,
        readonly filterEthnicityModel: Repository<FilterEthnicity>,
        readonly filterOtherFeatureModel: Repository<FilterOtherFeature>,
        readonly alternativeNameModel: Repository<AlternativeName>,
        readonly filterGroupModel: Repository<FilterGroup>,
        readonly filterSummaryModel: Repository<FilterSummary>,
        readonly filterBulletListModel: Repository<FilterBulletList>,
        readonly studyLinkModel: Repository<StudyLink>,
    ) { }

    protected async create(body: ICreateBiomarker & { templateId?: number, type: BiomarkerTypes }, transaction?: Transaction): Promise<Biomarker> {
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

    abstract createBiomarker(body: ICreateBiomarker, transaction?: Transaction): Promise<Biomarker>;

    abstract createRule(body: ICreateBiomarker, transaction?: Transaction): Promise<Biomarker>;

    async attachFilter(filter: ICreateFilter, biomarkerId: number, transaction?: Transaction): Promise<void> {
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

        await this.attachAllToFilter(filter, createdFilter.id, transaction);
    }

    async attachAllToFilter(filter: ICreateFilter, filterId: number, transaction?: Transaction) {
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

    protected async attachRecommendationsToFilter(recommendations: IAddRecommendation[], filterId: number, transaction?: Transaction): Promise<void> {
        const recommendationsToCreate: any[] = recommendations.map(recommendation => Object.assign({ filterId }, recommendation));
        await this.filterRecommendationModel.bulkCreate(recommendationsToCreate, { transaction });
    }

    protected async attachInteractionsToFilter(interactions: ICreateInteraction[], filterId: number, transaction?: Transaction): Promise<void> {
        const interactionsToCreate: any[] = interactions.map(interaction => Object.assign({ filterId }, interaction));
        await this.interactionModel.bulkCreate(interactionsToCreate, { transaction });
    }

    protected async attachFilterCharacteristics(filter: ICreateFilter, filterId: number, transaction?: Transaction): Promise<void> {
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

    async attachGroupsToFilter(groups: ICreateFilterGroup[], filterId: number, transaction?: Transaction): Promise<void> {
        const groupsToCreate = [];
        groups.forEach(group => {
            group.recommendationTypes.forEach(recommendationType => {
                groupsToCreate.push({ filterId, recommendationType, type: group.type });
            });
        });
        await this.filterGroupModel.bulkCreate(groupsToCreate, { transaction });
    }

    async attachSummaryToFilter(summary: ICreateResultSummary, filterId: number, transaction?: Transaction): Promise<void> {
        const filterSummaryToCreate: any = Object.assign({ filterId }, summary);
        await this.filterSummaryModel.create(filterSummaryToCreate, { transaction });
    }

    async attachBulletListToFilter(bulletList: ICreateFilterBulletList[], filterId: number, category: BulletListCategories, transaction?: Transaction): Promise<void> {
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

    async dettachAllFromFilter(filterId: number, transaction?: Transaction): Promise<void> {
        const promises = [
            this.filterRecommendationModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.interactionModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.filterAgeModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.filterSexModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.filterEthnicityModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.filterOtherFeatureModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.filterGroupModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.filterSummaryModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
            this.filterBulletListModel
                .scope([{ method: ['byFilterId', filterId] }])
                .destroy({ transaction }),
        ];

        await Promise.all(promises);
    }
}