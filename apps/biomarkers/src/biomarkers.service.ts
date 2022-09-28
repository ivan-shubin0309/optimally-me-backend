import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { Biomarker, ICreateBiomarker } from './models';
import { RulesService } from './services/rules/rules.service';
import { InteractionsService } from './services/interactions/interactions.service';
import { AlternativeNamesService } from './services/alternativeNames/alternative.service';
import { RecommendationsService } from './services/recommendations/recommendations.service';
import { CreateParamsHelper } from '../../common/src/utils/helpers/create-params.helper';
import { FiltersService } from './services/filters/filters.service';
import { FilterCharacteristicsService } from './services/filterCharacteristicsService/filter-characteristics.service';
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
        private readonly filterCharacteristicsService: FilterCharacteristicsService,
        @Inject('BIOMARKER_MODEL') private readonly biomarkerModel: Repository<Biomarker>
    ) {}

    async createBiomarker(body: CreateBiomarkerDto, userId: number): Promise<void> {
        const biomarkerRuleParam = this.createParamsHelper.createParamsForBiomarkerRules(body);
        const biomarkerRule = await this.rulesService.createBiomarkerRule(biomarkerRuleParam);

        if (body.rule && body.rule.name && body.rule.name.trim() !== '') {
            await this.rulesService.createLibraryRuleMethod(body);
        }

        let interactionParam;
        if (body.rule && body.rule.interactionsIsOn) {
            for await (const el of body.rule.interactions ) {
                interactionParam = this.createParamsHelper.createParamsForInteraction(biomarkerRule.id, el);
                await this.interactionsService.createBiomarkerInteraction(interactionParam);
            }
        }

        const biomarkerParam = this.createParamsHelper.createParamsForBiomarker(body, userId, biomarkerRule.id);
        const biomarker = await this.create(biomarkerParam);

        for await (const filter of body.rule.filters ) {

            const biomarkerFilterParam = this.createParamsHelper.createParamsForFilter(biomarkerRule.id, filter);
            const biomarkerFilter = await this.filtersService.createBiomarkerFilter(biomarkerFilterParam);

            await this.filterCharacteristicsService.createFilterCharacteristics(filter, biomarkerFilter.id);
            if (filter.recommendationsIsOn) {
                await this.recommendationsService.createFilterRecommendations(filter, biomarkerFilter.id, biomarker.id);
            }

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

    create(body: ICreateBiomarker): Promise<Biomarker> {
        return this.biomarkerModel.create({ ...body });
    }

    getBiomarkerByName(name: string): Promise<Biomarker> {
        return this.biomarkerModel
            .findOne({
                where: {
                    name
                }
            });
    }
}

