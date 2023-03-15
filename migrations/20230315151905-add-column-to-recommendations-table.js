'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        ADD COLUMN orderValue INTEGER NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        DROP COLUMN orderValue;
    `);
  }
};
