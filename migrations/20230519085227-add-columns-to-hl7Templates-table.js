'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Templates
        ADD COLUMN activatedAtDaysCount INTEGER UNSIGNED NULL,
        ADD COLUMN sampleAtDaysCount INTEGER UNSIGNED NULL,
        ADD COLUMN labReceivedAtDaysCount INTEGER UNSIGNED NULL,
        ADD COLUMN resultAtDaysCount INTEGER UNSIGNED NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Templates
        DROP COLUMN activatedAtDaysCount INTEGER UNSIGNED NULL,
        DROP COLUMN sampleAtDaysCount INTEGER UNSIGNED NULL,
        DROP COLUMN labReceivedAtDaysCount INTEGER UNSIGNED NULL,
        DROP COLUMN resultAtDaysCount INTEGER UNSIGNED NULL;
    `);
  }
};
