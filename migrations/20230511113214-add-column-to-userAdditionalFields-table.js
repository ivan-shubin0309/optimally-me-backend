'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        ADD COLUMN shopifyCustomerId VARCHAR(255) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        DROP COLUMN shopifyCustomerId;
    `);
  }
};
