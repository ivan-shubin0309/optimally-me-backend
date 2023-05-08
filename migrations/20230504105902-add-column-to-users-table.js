'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE users
        ADD COLUMN additionalAuthenticationType TINYINT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE users
        DROP COLUMN additionalAuthenticationType;
    `);
  }
};
