'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        ADD COLUMN dnaAgeResultId INTEGER NULL,
        ADD CONSTRAINT fk_dnaAgeResult FOREIGN KEY (dnaAgeResultId) REFERENCES dnaAgeResults (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        DROP FOREIGN KEY fk_dnaAgeResult,
        DROP COLUMN dnaAgeResultId;
    `);
  }
};
