'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        DROP COLUMN summary;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        ADD COLUMN summary TEXT(5000) NULL;
    `);
  }
};
