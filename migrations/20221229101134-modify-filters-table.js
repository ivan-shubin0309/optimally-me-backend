'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        MODIFY COLUMN name VARCHAR(200) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        MODIFY COLUMN name VARCHAR(200) NOT NULL;
    `);
  }
};
