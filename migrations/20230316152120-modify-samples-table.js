'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE samples
        MODIFY COLUMN sampleId VARCHAR(11) NOT NULL UNIQUE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE samples
        MODIFY COLUMN sampleId VARCHAR(6) NOT NULL UNIQUE;
    `);
  }
};
