'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitterHeartrateSummary
        ADD COLUMN dailySummaryId INTEGER NULL,
        ADD CONSTRAINT dailySummaryHeartrate_fk FOREIGN KEY dailySummary (dailySummaryId) REFERENCES userWefitterDailySummary (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitterHeartrateSummary
        DROP FOREIGN KEY dailySummaryHeartrate_fk,
        DROP COLUMN dailySummaryId;
    `);
  }
};
