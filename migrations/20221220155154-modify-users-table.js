'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
            ALTER TABLE users
              MODIFY COLUMN firstName VARCHAR(50) NULL,
              MODIFY COLUMN lastName VARCHAR(50) NULL;
        `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
            ALTER TABLE users
              MODIFY COLUMN firstName VARCHAR(20) NULL,
              MODIFY COLUMN lastName VARCHAR(20) NULL;
        `);
  }
};
