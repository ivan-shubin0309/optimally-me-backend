'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userQuizes
        ADD COLUMN submittedAt DATETIME NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userQuizes
        DROP COLUMN submittedAt;
    `);
  }
};
