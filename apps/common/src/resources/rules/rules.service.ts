import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BiomarkerRule, LibraryRule, ICreateRule } from '../../../../biomarkers/src/models';
import { CreateParamsHelper } from '../../utils/helpers/create-params.helper';
import { InteractionsService } from '../interactions/interactions.service';
import { FiltersService } from '../filters/filters.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { FilterSexAgeEthnicityOtherFeatureService } from '../filterSexAgeEthnicityOtherFeature/filter-sex-age-ethnicity-other-feature.service';
import { CreateBiomarkerDto } from '../../../../biomarkers/src/models';

@Injectable()
export class RulesService {
  constructor(
    private readonly createParamsHelper: CreateParamsHelper,
    private readonly interactionsService: InteractionsService,
    private readonly filtersService: FiltersService,
    private readonly recommendationsService: RecommendationsService,
    private readonly filterSexAgeEthnicityOtherFeatureService: FilterSexAgeEthnicityOtherFeatureService,
    @Inject('BIOMARKER_RULE_MODEL') private readonly biomarkerRuleModel: Repository<BiomarkerRule>,
    @Inject('LIBRARY_RULE_MODEL') private readonly libraryRuleModel: Repository<LibraryRule>
  ) {}

  async createLibraryRuleMethod(body: CreateBiomarkerDto): Promise<void> {
    const libraryRuleParam = this.createParamsHelper.createParamsForBiomarkerRules(body);
    const libraryRule = await this.createLibraryRule(libraryRuleParam);

    let interactionParam;
    for await (const el of body.rule.interactions ) {
        interactionParam = this.createParamsHelper.createParamsForInteraction(libraryRule.id, el);
        await this.interactionsService.createLibraryInteraction(interactionParam);
    }

    for await (const filter of body.rule.filters ) {

        const libraryFilterParam = this.createParamsHelper.createParamsForFilter(libraryRule.id, filter);
        const libraryFilter = await this.filtersService.createLibraryFilter(libraryFilterParam);

        await this.filterSexAgeEthnicityOtherFeatureService.createLibraryFilterSexAgeEthnicityOtherFeature(filter, libraryFilter.id);
        await this.recommendationsService.createLibraryFilterRecommendations(filter, libraryFilter.id);
    }
  }


  createBiomarkerRule(body: ICreateRule):  Promise<BiomarkerRule> {
    return this.biomarkerRuleModel.create({ ...body });
  }

  createLibraryRule(body: ICreateRule):  Promise<LibraryRule> {
    return this.libraryRuleModel.create({ ...body });
  }
}