'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        ADD COLUMN percentile DECIMAL(10, 2) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        DROP COLUMN percentile;
    `);
  }
};
