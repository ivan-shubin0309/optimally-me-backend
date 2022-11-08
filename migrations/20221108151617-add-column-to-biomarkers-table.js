'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        ADD COLUMN label VARCHAR(4) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        DROP COLUMN label;
    `);
  }
};
