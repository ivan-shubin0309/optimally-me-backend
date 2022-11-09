'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitterDailySummary
        MODIFY COLUMN distance FLOAT NULL,
        MODIFY COLUMN steps FLOAT NULL,
        MODIFY COLUMN calories FLOAT NULL,
        MODIFY COLUMN activeCalories FLOAT NULL,
        MODIFY COLUMN bmrCalories FLOAT NULL,
        MODIFY COLUMN points FLOAT NULL,

        DROP COLUMN heartRateSummaryMin,
        DROP COLUMN heartRateSummaryMax,
        DROP COLUMN heartRateSummaryAverage,
        DROP COLUMN heartRateSummaryResting,
        
        DROP COLUMN stressQualifier,
        DROP COLUMN averageStressLevel,
        DROP COLUMN maxStressLevel,
        DROP COLUMN restStressDuration,
        DROP COLUMN lowStressDuration,
        DROP COLUMN mediumStressDuration,
        DROP COLUMN highStressDuration,
        DROP COLUMN stressDuration;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitterDailySummary
        MODIFY COLUMN distance DOUBLE NULL,
        MODIFY COLUMN steps DOUBLE NULL,
        MODIFY COLUMN calories DOUBLE NULL,
        MODIFY COLUMN activeCalories DOUBLE NULL,
        MODIFY COLUMN bmrCalories DOUBLE NULL,
        MODIFY COLUMN points DOUBLE NULL,

        ADD COLUMN heartRateSummaryMin INTEGER NULL,
        ADD COLUMN heartRateSummaryMax INTEGER NULL,
        ADD COLUMN heartRateSummaryAverage INTEGER NULL,
        ADD COLUMN heartRateSummaryResting INTEGER NULL,
        
        ADD COLUMN stressQualifier VARCHAR(255) NULL,
        ADD COLUMN averageStressLevel INTEGER NULL,
        ADD COLUMN maxStressLevel INTEGER NULL,
        ADD COLUMN restStressDuration VARCHAR(255) NULL,
        ADD COLUMN lowStressDuration VARCHAR(255) NULL,
        ADD COLUMN mediumStressDuration VARCHAR(255) NULL,
        ADD COLUMN highStressDuration VARCHAR(255) NULL,
        ADD COLUMN stressDuration VARCHAR(255) NULL;
    `);
  }
};
