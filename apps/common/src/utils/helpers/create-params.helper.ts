
export class CreateParamsHelper {
    createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, type) {
        const filterRecommendationParam = {
            biomarkerId: biomarkerId,
            filterId: filterId,
            recommendationId: element.id,
            type: type,
            recommendationOrder: element.order
        };
        return filterRecommendationParam;
    }

    createParamsForRecommendationLibraryFilter(element, filterId, type) {
        const filterRecommendationParam = {
            filterId: filterId,
            recommendationId: element.id,
            type: type,
            recommendationOrder: element.order
        };
        return filterRecommendationParam;
    }

    createParamsForBiomarkerRules(body) {
        const biomarkerRuleParam = {
            name: body.rule.name,
            summary: body.rule.summary,
            whatIsIt: body.rule.whatIsIt,
            whatAreTheCauses: body.rule.whatAreTheCauses,
            whatAreTheRisks: body.rule.whatAreTheRisks,
            whatCanYouDo: body.rule.whatCanYouDo,
            interactionsIsOn: body.rule.interactionsIsOn
        };
        return biomarkerRuleParam;
    }

    createParamsForInteraction(id, interaction) {
        const interactionParam = {
            ruleId: id,
            type: interaction.type,
            name: interaction.name,
            alsoKnowAs: interaction.alsoKnowAs,
            impact: interaction.impact,
            effects: interaction.effects,
        };
        return interactionParam;
    }

    createParamsForBiomarker(body, userId, ruleId) {
        const biomarkerParam = {
            name: body.name,
            userId,
            categoryId: body.category,
            unitId: body.unit,
            ruleId
            };
        return biomarkerParam;
    }

    createParamsForFilter(ruleId, filter) {
        const biomarkerFilterParam = {
            ruleId: ruleId,
            name: filter.name,
            criticalLow: filter.ranges.criticalLow,
            lowMin: filter.ranges.low.min,
            lowMax: filter.ranges.low.max,
            subOptimalMin: filter.ranges.subOptimal.min,
            subOptimalMax: filter.ranges.subOptimal.max,
            optimalMin: filter.ranges.low.min,
            optimalMax: filter.ranges.low.max,
            supraOptimalMin: filter.ranges.supraOptimal.min,
            supraOptimalMax: filter.ranges.supraOptimal.max,
            HighMin: filter.ranges.high.min,
            HighMax: filter.ranges.high.max,
            criticalHigh: filter.ranges.criticalHigh,
            recommendationsIsOn: filter.recommendationsIsOn
        };
        return biomarkerFilterParam;
    }

    createParamsForSexFilter(filterId, sex) {
        const biomarkerParam = {
            filterId,
            sex
            };
        return biomarkerParam;
    }

    createParamsForAgeFilter(filterId, age) {
        const biomarkerParam = {
            filterId,
            age
            };
        return biomarkerParam;
    }

    createParamsForEthnicityFilter(filterId, ethnicity) {
        const biomarkerParam = {
            filterId,
            ethnicity
            };
        return biomarkerParam;
    }

    createParamsForOtherFeature(filterId, otherFeature) {
        const biomarkerParam = {
            filterId,
            otherFeature
            };
        return biomarkerParam;
    }
}