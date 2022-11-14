'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        DROP COLUMN whatAreTheCauses,
        ADD COLUMN whatAreTheCausesLow TEXT(10000) NULL,
        ADD COLUMN whatAreTheCausesHigh TEXT(10000) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        ADD COLUMN whatAreTheCauses TEXT(5000) NULL,
        DROP COLUMN whatAreTheCausesLow,
        DROP COLUMN whatAreTheCausesHigh;
    `);
  }
};
