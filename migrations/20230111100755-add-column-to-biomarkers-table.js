'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        ADD COLUMN isActive BOOLEAN NOT NULL DEFAULT TRUE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        DROP COLUMN isActive;
    `);
  }
};
