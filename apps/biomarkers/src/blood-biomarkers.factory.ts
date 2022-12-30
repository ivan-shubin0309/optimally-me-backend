import { Inject, Injectable } from '@nestjs/common';
import { BiomarkerTypes } from '../../common/src/resources/biomarkers/biomarker-types';
import { Repository } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { Biomarker } from './models/biomarker.entity';
import { CreateBloodBiomarkerDto } from './models/create-blood-biomarker.dto';
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
import { BiomarkerHelper } from '../../common/src/resources/biomarkers/biomarker-helper';
import { BiomarkersFactory } from './biomarkers.factory';
import { FilterSkinType } from './models/filterSkinTypes/filter-skin-type.entity';
import { FilterContradiction } from './models/filterContradictions/filter-contradiction.entity';

@Injectable()
export class BloodBiomarkersFactory extends BiomarkersFactory {
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
        @Inject('FILTER_SKIN_TYPE_MODEL') readonly filterSkinTypeModel: Repository<FilterSkinType>,
        @Inject('FILTER_CONTRADICTION_MODEL') readonly filterContradiction: Repository<FilterContradiction>,
    ) {
        super(
            biomarkerModel,
            filterModel,
            filterRecommendationModel,
            interactionModel,
            filterSexModel,
            filterAgeModel,
            filterEthnicityModel,
            filterOtherFeatureModel,
            alternativeNameModel,
            filterGroupModel,
            filterSummaryModel,
            filterBulletListModel,
            studyLinkModel,
            filterSkinTypeModel,
            filterContradiction,
        );
    }

    async createBiomarker(body: CreateBloodBiomarkerDto, transaction?: Transaction): Promise<Biomarker> {
        let templateId;
        if (body.ruleName) {
            const rule = await this.createRule(body, transaction);
            templateId = rule.id;
        } else {
            templateId = body.ruleId;
        }

        const sex = BiomarkerHelper.getBiomarkerSex(body);

        return this.create(Object.assign({ type: BiomarkerTypes.blood, templateId, sex }, body), transaction);
    }

    async createRule(body: CreateBloodBiomarkerDto, transaction?: Transaction): Promise<Biomarker> {
        const ruleToCreate = Object.assign(
            {},
            body,
            { type: BiomarkerTypes.bloodRule, name: body.ruleName, label: null, shortName: null }
        );
        return this.create(ruleToCreate, transaction);
    }
}