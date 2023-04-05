'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        ADD COLUMN userOtherFeature TINYINT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        DROP COLUMN userOtherFeature;
    `);
  }
};
