'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        ADD COLUMN registrationSource TINYINT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        DROP COLUMN registrationSource;
    `);
  }
};
