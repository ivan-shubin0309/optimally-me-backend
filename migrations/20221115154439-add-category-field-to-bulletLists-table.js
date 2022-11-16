'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filterBulletLists
        ADD COLUMN category TINYINT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filterBulletLists
        DROP COLUMN category;
    `);
  }
};
