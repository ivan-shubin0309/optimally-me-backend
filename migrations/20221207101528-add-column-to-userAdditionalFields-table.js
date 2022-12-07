'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        ADD COLUMN registrationStep TINYINT NOT NULL DEFAULT 1,
        ADD COLUMN isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        DROP COLUMN registrationStep,
        DROP COLUMN isEmailVerified;
    `);
  }
};
