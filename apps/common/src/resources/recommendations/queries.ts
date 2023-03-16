export const countRecommendationBiomarkersQuery = (userResultIds: number[]) => `
    SELECT 
        COUNT(\`userResults\`.\`biomarkerId\`)
    FROM
        \`userRecommendations\`
        INNER JOIN \`userResults\`
        ON \`userRecommendations\`.\`userResultId\` = \`userResults\`.\`id\`
            AND \`userResults\`.\`id\` IN (${userResultIds.join(', ')})
    WHERE
        \`userRecommendations\`.\`recommendationId\` = \`Recommendation\`.\`id\`
`.replace(/\s+/ig, ' ').trim();

export const minRecommendationOrderQuery = `
    SELECT 
        MIN(\`filterRecommendations\`.\`order\`)
    FROM
        \`filterRecommendations\`
    WHERE
        \`filterRecommendations\`.\`recommendationId\` = \`Recommendation\`.\`id\`
`.replace(/\s+/ig, ' ').trim();