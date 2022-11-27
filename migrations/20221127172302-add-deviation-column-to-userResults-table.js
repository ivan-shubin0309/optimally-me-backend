'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        ADD COLUMN deviation FLOAT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        DROP COLUMN deviation;
    `);
  }
};
