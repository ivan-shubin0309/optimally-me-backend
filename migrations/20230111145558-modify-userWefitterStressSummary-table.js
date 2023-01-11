'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitterStressSummary
        ADD COLUMN dailySummaryId INTEGER NULL,
        ADD CONSTRAINT dailySummaryStress_fk FOREIGN KEY dailySummary (dailySummaryId) REFERENCES userWefitterDailySummary (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitterStressSummary
        DROP FOREIGN KEY dailySummaryStress_fk,
        DROP COLUMN dailySummaryId;
    `);
  }
};
