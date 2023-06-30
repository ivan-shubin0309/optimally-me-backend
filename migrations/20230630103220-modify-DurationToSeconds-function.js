'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP FUNCTION IF EXISTS DurationToSeconds;
        `);
        await queryInterface.sequelize.query(`
            CREATE FUNCTION IF NOT EXISTS DurationToSeconds (dur CHAR(32))
            RETURNS INTEGER DETERMINISTIC
            RETURN (CASE
                WHEN dur LIKE 'PT%H%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%kH%iM%s.%fS'))
                WHEN dur LIKE 'P%DT%H%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'P%dDT%HH%iM%s.%fS'))
                WHEN dur LIKE 'P%DT%H%M%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'P%dDT%HH%iM%sS'))
                WHEN dur LIKE 'PT%H%M%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%HH%iM%sS'))
                WHEN dur LIKE 'PT%H%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%kH%s.%fS'))
                WHEN dur LIKE 'PT%H%M%' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%HH%iM%'))
                WHEN dur LIKE 'PT%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%iM%s.%fS'))
                WHEN dur LIKE 'PT%M%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%iM%sS'))
                WHEN dur LIKE 'PT%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%s.%fS'))
                WHEN dur LIKE 'PT%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%sS'))
                WHEN dur LIKE 'PT%M' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%iM%'))
                WHEN dur LIKE 'P0D' THEN 0
                WHEN dur LIKE 'PT%H%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%sHH%.%fS'))
            END);
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP FUNCTION IF EXISTS DurationToSeconds;
        `);
        await queryInterface.sequelize.query(`
            CREATE FUNCTION IF NOT EXISTS DurationToSeconds (dur CHAR(32))
            RETURNS INTEGER DETERMINISTIC
            RETURN (CASE
                WHEN dur LIKE 'P%DT%H%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'P%dDT%HH%iM%s.%fS'))
                WHEN dur LIKE 'P%DT%H%M%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'P%dDT%HH%iM%sS'))
                WHEN dur LIKE 'PT%H%M%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%HH%iM%sS'))
                WHEN dur LIKE 'PT%H%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%HH%iM%s.%fS'))
                WHEN dur LIKE 'PT%H%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%kH%s.%fS'))
                WHEN dur LIKE 'PT%H%M%' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%HH%iM%'))
                WHEN dur LIKE 'PT%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%iM%s.%fS'))
                WHEN dur LIKE 'PT%M%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%iM%sS'))
                WHEN dur LIKE 'PT%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%s.%fS'))
                WHEN dur LIKE 'PT%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%sS'))
                WHEN dur LIKE 'PT%M' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%iM%'))
                WHEN dur LIKE 'P0D' THEN 0
                WHEN dur LIKE 'PT%H%.%S' THEN TIME_TO_SEC(STR_TO_DATE(dur, 'PT%sHH%.%fS'))
            END);
        `);
    }
};
