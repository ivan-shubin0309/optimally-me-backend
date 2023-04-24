'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7ObjectErrorNotifications
        ADD COLUMN isMultipleError BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7ObjectErrorNotifications
        DROP COLUMN isMultipleError;
    `);
  }
};
