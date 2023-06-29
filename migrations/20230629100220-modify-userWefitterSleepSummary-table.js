'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE FUNCTION IF NOT EXISTS DurationToSeconds (dur CHAR(32))
            RETURNS INTEGER DETERMINISTIC
            RETURN (CASE
                WHEN duration LIKE 'P%DT%H%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'P%dDT%HH%iM%s.%fS'))
                WHEN duration LIKE 'P%DT%H%M%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'P%dDT%HH%iM%sS'))
                WHEN duration LIKE 'PT%H%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%HH%iM%s.%fS'))
                WHEN duration LIKE 'PT%H%M%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%HH%iM%sS'))
                WHEN duration LIKE 'PT%H%M%' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%HH%iM%'))
                WHEN duration LIKE 'PT%M%.%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%iM%s.%fS'))
                WHEN duration LIKE 'PT%M%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%iM%sS'))
                WHEN duration LIKE 'PT%.%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%s.%fS'))
                WHEN duration LIKE 'PT%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%sS'))
                WHEN duration LIKE 'PT%M' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%iM%'))
                WHEN duration LIKE 'P0D' THEN 0
                WHEN duration LIKE 'PT%H%.%S' THEN TIME_TO_SEC(STR_TO_DATE(duration, 'PT%sHH%.%fS'))
            END);
        `);
        await queryInterface.sequelize.query(`
                
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP FUNCTION IF EXISTS DurationToSeconds;
        `);
    }
};
