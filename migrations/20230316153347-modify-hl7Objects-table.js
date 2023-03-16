'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN sampleCode VARCHAR(11) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN sampleCode VARCHAR(6) NULL;
    `);
  }
};
