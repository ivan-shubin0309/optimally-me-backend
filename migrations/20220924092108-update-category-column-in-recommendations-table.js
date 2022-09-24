'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        DROP categories,
        ADD COLUMN category TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - diet, 2 - lifestyle, 3 - supplements, 4 - doctor, 5 - tests';
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendations
        ADD COLUMN categories TINYINT NOT NULL DEFAULT 0 COMMENT '1 - diet, 2 - lifestyle, 3 - supplements, 4 - doctor, 5 - tests',
        DROP category;
    `);
  }
};
