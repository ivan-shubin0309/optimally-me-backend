'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE verificationTokens
        ADD COLUMN isExpired BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE verificationTokens
        DROP COLUMN isExpired;
    `);
  }
};
