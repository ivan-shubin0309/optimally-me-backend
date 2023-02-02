import { RecommendationTypes } from '../recommendations/recommendation-types';

export function getLastUserResultsForEachBiomarker(userId: number, numberOfLastRecords: number, beforeDate?: string): string {
    return `
        SELECT
            \`orderedUserResults\`.\`id\` as \`id\`
        FROM (
            SELECT
                \`userResults\`.\`id\` as \`id\`,
                ROW_NUMBER() OVER (PARTITION BY \`userResults\`.\`biomarkerId\` ORDER BY \`userResults\`.\`date\` DESC) as \`orderValue\`        
            FROM \`userResults\`
            WHERE \`userResults\`.\`userId\`=${userId}
            ${beforeDate ? `AND \`userResults\`.\`date\`<='${beforeDate}'` : ''}
        ) as \`orderedUserResults\`
        WHERE \`orderedUserResults\`.\`orderValue\` <= ${numberOfLastRecords}
    `.replace(/\s+/ig, ' ').trim();
}

export const OrderValueQuery = `
    IF(
        \`lastResult\`.\`recommendationRange\` IN (${RecommendationTypes.criticalHigh}, ${RecommendationTypes.criticalLow}, ${RecommendationTypes.high}, ${RecommendationTypes.low}),
        3,
        IF(
            \`lastResult\`.\`recommendationRange\` IN (${RecommendationTypes.subOptimal}, ${RecommendationTypes.supraOptimal}),
            2,
            IF(\`lastResult\`.\`recommendationRange\` = ${RecommendationTypes.optimal}, 1, 0)
        )
    ) as \`orderValue\`
`.replace(/\s+/ig, ' ').trim();

export const RangeCountersQuery = `
    IF(
        \`lastResult\`.\`recommendationRange\` < ${RecommendationTypes.optimal},
        IF(
            \`lastResult\`.\`recommendationRange\` = ${RecommendationTypes.low} 
                AND \`lastResult->filter\`.\`criticalLow\` IS NULL,
            ${RecommendationTypes.criticalLow},
            \`lastResult\`.\`recommendationRange\`
        ),
        IF(
            \`lastResult\`.\`recommendationRange\` = ${RecommendationTypes.high} 
                AND \`lastResult->filter\`.\`criticalHigh\` IS NULL,
            ${RecommendationTypes.criticalHigh},
            \`lastResult\`.\`recommendationRange\`
        )
    )
`.replace(/\s+/ig, ' ').trim();