'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE files
        ADD COLUMN bytes INTEGER NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE files
        DROP COLUMN bytes;
    `);
  }
};
