
export class CreateParamsHelper {
    createParamsForRecommendationBiomarkerFilter(element, filterId, biomarkerId, type) {
        return {
            biomarkerId: biomarkerId,
            filterId: filterId,
            recommendationId: element.id,
            type: type,
            recommendationOrder: element.order
        };
    }

    createParamsForRecommendationLibraryFilter(element, filterId, type) {
        return {
            filterId: filterId,
            recommendationId: element.id,
            type: type,
            recommendationOrder: element.order
        };
    }

    createParamsForBiomarkerRules(body) {
        return {
            name: body.rule.name,
            summary: body.rule.summary,
            whatIsIt: body.rule.whatIsIt,
            whatAreTheCauses: body.rule.whatAreTheCauses,
            whatAreTheRisks: body.rule.whatAreTheRisks,
            whatCanYouDo: body.rule.whatCanYouDo,
            interactionsIsOn: body.rule.interactionsIsOn
        };
    }

    createParamsForInteraction(id, interaction) {
        return {
            ruleId: id,
            type: interaction.type,
            name: interaction.name,
            alsoKnowAs: interaction.alsoKnowAs,
            impact: interaction.impact,
            effects: interaction.effects,
        };
    }

    createParamsForBiomarker(body, userId, ruleId) {
        return {
            name: body.name,
            userId,
            categoryId: body.category,
            unitId: body.unit,
            ruleId
        };
    }

    createParamsForFilter(ruleId, filter) {
        return {
            ruleId: ruleId,
            name: filter.name,
            criticalLow: filter.ranges.criticalLow,
            lowMin: filter.ranges.lowMin,
            lowMax: filter.ranges.lowMax,
            subOptimalMin: filter.ranges.subOptimalMin,
            subOptimalMax: filter.ranges.subOptimalMax,
            optimalMin: filter.ranges.optimalMin,
            optimalMax: filter.ranges.optimalMax,
            supraOptimalMin: filter.ranges.supraOptimalMin,
            supraOptimalMax: filter.ranges.supraOptimalMax,
            HighMin: filter.ranges.highMin,
            HighMax: filter.ranges.highMax,
            criticalHigh: filter.ranges.criticalHigh,
            recommendationsIsOn: filter.recommendationsIsOn
        };
    }

    createParamsForSexFilter(filterId, sex) {
        return { filterId, sex };
    }

    createParamsForAgeFilter(filterId, age) {
        return { filterId, age };
    }

    createParamsForEthnicityFilter(filterId, ethnicity) {
        return { filterId, ethnicity };
    }

    createParamsForOtherFeature(filterId, otherFeature) {
        return { filterId, otherFeature };
    }
}