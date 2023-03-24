'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN failedTests VARCHAR(3000) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN failedTests VARCHAR(255) NULL;
    `);
  }
};
