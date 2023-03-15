export const countRecommendationBiomarkersQuery = `
    SELECT 
        COUNT(\`filters\`.\`biomarkerId\`)
    FROM
        \`filterRecommendations\`
        LEFT JOIN \`filters\`
        ON \`filterRecommendations\`.\`filterId\` = \`filters\`.\`id\`
    WHERE
        \`filterRecommendations\`.\`recommendationId\` = \`Recommendation\`.\`id\`
`.replace(/\s+/ig, ' ').trim();

export const minRecommendationOrderQuery = `
    SELECT 
        MIN(\`filterRecommendations\`.\`order\`)
    FROM
        \`filterRecommendations\`
    WHERE
        \`filterRecommendations\`.\`recommendationId\` = \`Recommendation\`.\`id\`
`.replace(/\s+/ig, ' ').trim();