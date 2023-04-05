'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSamples
        ADD COLUMN userOtherFeature TINYINT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSamples
        DROP COLUMN userOtherFeature;
    `);
  }
};
