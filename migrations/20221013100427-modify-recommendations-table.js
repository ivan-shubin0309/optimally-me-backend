'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        ADD COLUMN title VARCHAR(255) NULL,
        ADD COLUMN type TINYINT NULL COMMENT '1 - increase, 2 - decrease, 3 - critical, 4 - check';
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        DROP COLUMN title,
        DROP COLUMN type;
    `);
  }
};
