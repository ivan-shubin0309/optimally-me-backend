import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Biomarker, ICreateBiomarker } from './models';
import { RulesService } from '../../common/src/resources/rules/rules.service';
import { InteractionsService } from '../../common/src/resources/interactions/interactions.service';
import { AlternativeNamesService } from '../../common/src/resources/alternativeNames/alternative.service';
import { RecommendationsService } from '../../common/src/resources/recommendations/recommendations.service';
import { CreateParamsHelper } from '../../common/src/utils/helpers/create-params.helper';
import { FiltersService } from '../../common/src/resources/filters/filters.service';
import { FilterSexAgeEthnicityOtherFeatureService } from '../../common/src/resources/filterSexAgeEthnicityOtherFeature/filter-sex-age-ethnicity-other-feature.service';
import { CreateBiomarkerDto } from './models';

@Injectable()
export class BiomarkersService {
    constructor(
        private readonly rulesService: RulesService,
        private readonly interactionsService: InteractionsService,
        private readonly alternativeNamesService: AlternativeNamesService,
        private readonly recommendationsService: RecommendationsService,
        private readonly createParamsHelper: CreateParamsHelper,
        private readonly filtersService: FiltersService,
        private readonly filterSexAgeEthnicityOtherFeatureService: FilterSexAgeEthnicityOtherFeatureService,
        @Inject('BIOMARKER_MODEL') private readonly biomarkerModel: Repository<Biomarker>
    ) {}

    async createBiomarker(body: CreateBiomarkerDto, userId: number): Promise<void> {
        const biomarkerRuleParam = this.createParamsHelper.createParamsForBiomarkerRules(body);
        const biomarkerRule = await this.rulesService.createBiomarkerRule(biomarkerRuleParam);

        if(body.rule && body.rule.name && body.rule.name.trim() !== '') {
            await this.rulesService.createLibraryRuleMethod(body);
        }

        let interactionParam;
        for await (const el of body.rule.interactions ) {
            interactionParam = this.createParamsHelper.createParamsForInteraction(biomarkerRule.id, el);
            await this.interactionsService.createBiomarkerInteraction(interactionParam);
        }

        const biomarkerParam = this.createParamsHelper.createParamsForBiomarker(body, userId, biomarkerRule.id);
        const biomarker = await this.create(biomarkerParam);

        for await (const filter of body.rule.filters ) {

            const biomarkerFilterParam = this.createParamsHelper.createParamsForFilter(biomarkerRule.id, filter);
            const biomarkerFilter = await this.filtersService.createBiomarkerFilter(biomarkerFilterParam);

            await this.filterSexAgeEthnicityOtherFeatureService.createFilterSexAgeEthnicityOtherFeature(filter, biomarkerFilter.id);
            await this.recommendationsService.createFilterRecommendations(filter, biomarkerFilter.id, biomarker.id);

            let alternativeNamesParam;
            for await (const el of body.alternativeNames ) {
                alternativeNamesParam = {
                biomarkerId: biomarker.id,
                name: el,
                };
                await this.alternativeNamesService.createBiomarkerAlternativeName(alternativeNamesParam);
            }
        }
    }

    create(body: ICreateBiomarker):  Promise<Biomarker> {
        return this.biomarkerModel.create({ ...body });
    }
}

