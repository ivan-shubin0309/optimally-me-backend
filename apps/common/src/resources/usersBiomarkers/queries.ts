import { RecommendationTypes } from '../recommendations/recommendation-types';

export function getLastUserResultsForEachBiomarker(userId: number, numberOfLastRecords: number, afterDate?: string, beforeDate?: string): string {


    return `
        SELECT
            \`orderedUserResults\`.\`id\` as \`id\`
        FROM (
            SELECT
                \`userResults\`.\`id\` as \`id\`,
                ROW_NUMBER() OVER (PARTITION BY \`userResults\`.\`biomarkerId\` ORDER BY \`userResults\`.\`date\` DESC, \`userResults\`.\`createdAt\` DESC) as \`orderValue\`        
            FROM \`userResults\`
            WHERE \`userResults\`.\`userId\`=${userId}
            ${beforeDate ? `AND IF(\`userResults\`.\`skinUserResultId\` IS NOT NULL, \`userResults\`.\`createdAt\`, \`userResults\`.\`date\`)<='${beforeDate}'` : ''}
            ${afterDate ? `AND IF(\`userResults\`.\`skinUserResultId\` IS NOT NULL, \`userResults\`.\`createdAt\`, \`userResults\`.\`date\`)>='${afterDate}'` : ''}
        ) as \`orderedUserResults\`
        WHERE \`orderedUserResults\`.\`orderValue\` <= ${numberOfLastRecords}
    `.replace(/\s+/ig, ' ').trim();
}

export const OrderValueQuery = `
    IF(
        \`lastResult\`.\`recommendationRange\` IN (${RecommendationTypes.criticalHigh}, ${RecommendationTypes.criticalLow}),
        5,
        IF(
            \`lastResult\`.\`recommendationRange\` IN (${RecommendationTypes.high}, ${RecommendationTypes.low}),
            IF(
                \`lastResult\`.\`recommendationRange\` = ${RecommendationTypes.high},
                IF(
                    \`lastResult->filter\`.\`criticalHigh\` IS NULL,
                    4,
                    3
                ),
                IF(
                    \`lastResult->filter\`.\`criticalLow\` IS NULL,
                    4,
                    3
                )
            ),
            IF(
                \`lastResult\`.\`recommendationRange\` IN (${RecommendationTypes.subOptimal}, ${RecommendationTypes.supraOptimal}),
                2,
                IF(\`lastResult\`.\`recommendationRange\` = ${RecommendationTypes.optimal}, 1, 0)
            )
        )
    ) as \`orderValue\`
`.replace(/\s+/ig, ' ').trim();