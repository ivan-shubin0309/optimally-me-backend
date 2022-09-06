'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
            ALTER TABLE users
              DROP username,
              ADD COLUMN firstName VARCHAR(20) NULL,
              ADD COLUMN lastName VARCHAR(20) NULL;
        `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
            ALTER TABLE users
              ADD COLUMN username VARCHAR (255) NULL,
              DROP firstName,
              DROP lastName;
        `);
  }
};
