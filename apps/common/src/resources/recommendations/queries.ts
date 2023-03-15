export const countRecommendationBiomarkersQuery = `
    SELECT 
        COUNT(\`filters\`.\`biomarkerId\`)
    FROM
        \`filterRecommendations\`
        LEFT JOIN \`filters\`
        ON \`filterRecommendations\`.\`filterId\` = \`filters\`.\`id\`
    WHERE
        \`filterRecommendations\`.\`recommendationId\` = \`recommendations\`.\`id\`
`.replace(/\s+/ig, ' ').trim();