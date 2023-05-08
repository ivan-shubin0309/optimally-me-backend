'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE verificationTokens
        ADD COLUMN code VARCHAR(255) NULL,
        MODIFY COLUMN token VARCHAR(1000) NOT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE verificationTokens
        DROP COLUMN code,
        MODIFY COLUMN token VARCHAR(255) NOT NULL;
    `);
  }
};
