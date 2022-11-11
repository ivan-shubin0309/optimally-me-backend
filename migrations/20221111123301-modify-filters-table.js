'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        DROP COLUMN whatAreTheRisks,
        ADD COLUMN whatAreTheRisksLow TEXT(10000) NULL,
        ADD COLUMN whatAreTheRisksHigh TEXT(10000) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        ADD COLUMN whatAreTheRisks TEXT(5000) NULL,
        DROP COLUMN whatAreTheRisksLow,
        DROP COLUMN whatAreTheRisksHigh;
    `);
  }
};
