'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE users
        MODIFY COLUMN role TINYINT NOT NULL COMMENT '1 - user, 2 - admin';
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE users
        MODIFY COLUMN role TINYINT NOT NULL COMMENT '1 - user, 2 - admin, 3 - superAdmin';
    `);
  }
};
