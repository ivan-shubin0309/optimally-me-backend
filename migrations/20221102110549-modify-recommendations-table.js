'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        MODIFY COLUMN content TEXT(10000) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        MODIFY COLUMN content VARCHAR(250) NULL;
    `);
  }
};
