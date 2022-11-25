export function getLastUserResultsForEachBiomarker(userId: number, numberOfLastRecords: number): string {
    return `
        SELECT
            \`orderedUserResults\`.\`id\` as \`id\`
        FROM (
            SELECT
                \`userResults\`.\`id\` as \`id\`,
                ROW_NUMBER() OVER (PARTITION BY \`userResults\`.\`biomarkerId\` ORDER BY \`userResults\`.\`date\` DESC) as \`orderValue\`        
            FROM \`userResults\`
            WHERE \`userResults\`.\`userId\`=${userId}
        ) as \`orderedUserResults\`
        WHERE \`orderedUserResults\`.\`orderValue\` <= ${numberOfLastRecords}
    `.replace(/\s+/ig, ' ').trim();
}