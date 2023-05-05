'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE verificationTokens
        ADD COLUMN code VARCHAR(255) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE verificationTokens
        DROP COLUMN code;
    `);
  }
};
