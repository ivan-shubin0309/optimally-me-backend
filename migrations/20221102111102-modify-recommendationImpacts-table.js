'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendationImpacts
        MODIFY COLUMN descriptionHigh TEXT(10000) NULL,
        MODIFY COLUMN descriptionLow TEXT(10000) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendationImpacts
        MODIFY COLUMN descriptionHigh VARCHAR(255) NULL,
        MODIFY COLUMN descriptionLow VARCHAR(255) NULL;
    `);
  }
};
