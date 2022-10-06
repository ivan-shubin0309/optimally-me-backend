'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        ADD COLUMN summary TEXT(5000) NULL,
        ADD COLUMN whatIsIt TEXT(5000) NULL,
        ADD COLUMN whatAreTheCauses TEXT(5000) NULL,
        ADD COLUMN whatAreTheRisks TEXT(5000) NULL,
        ADD COLUMN whatCanYouDo TEXT(5000) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        DROP COLUMN summary,
        DROP COLUMN whatIsIt,
        DROP COLUMN whatAreTheCauses,
        DROP COLUMN whatAreTheRisks,
        DROP COLUMN whatCanYouDo;
    `);
  }
};
