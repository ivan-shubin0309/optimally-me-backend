'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        ADD COLUMN isAddToCartAllowed BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        DROP COLUMN isAddToCartAllowed;
    `);
  }
};
