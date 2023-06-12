'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW lastDataSources AS 
        SELECT
          orderedSummary.userId,
          orderedSummary.source,
          orderedSummary.date
        FROM (
          SELECT 
            unionSummary.userId as userId,
            unionSummary.source as source,
            unionSummary.date as date,
            ROW_NUMBER() OVER (PARTITION BY unionSummary.userId, unionSummary.source ORDER BY unionSummary.date DESC) as orderValue
          FROM (
            SELECT 
              userId as userId,
              source as source,
              date as date
            FROM userWefitterDailySummary
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM userWefitterHeartrateSummary
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM userWefitterSleepSummary
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM wefitterBloodPressure
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM wefitterBloodSugar
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM wefitterDiastolicBloodPressure
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM wefitterHrvSleep
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM wefitterSystolicBloodPressure
            UNION SELECT 
              userId as userId,
              source as source,
              timestamp as date
            FROM wefitterVo2Max
          ) as unionSummary
        ) as orderedSummary
        WHERE orderedSummary.orderValue <= 1;
    `);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP VIEW IF EXISTS lastDataSources;');
  }
};
