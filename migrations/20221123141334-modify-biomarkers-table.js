'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        MODIFY COLUMN name VARCHAR(200) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE biomarkers
        MODIFY COLUMN name VARCHAR(100) NULL;
    `);
  }
};
