'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        ADD COLUMN hautAiMetricType TINYINT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        DROP COLUMN hautAiMetricType;
    `);
  }
};
