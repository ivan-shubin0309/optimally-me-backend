'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        ADD COLUMN sex TINYINT NOT NULL DEFAULT 3;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        DROP COLUMN sex;
    `);
  }
};
