'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSkinDiaries
        ADD COLUMN skinUserResultId INTEGER NULL,
        ADD CONSTRAINT fk_skinUserResult FOREIGN KEY (skinUserResultId) REFERENCES skinUserResults (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSkinDiaries
        DROP FOREIGN KEY fk_skinUserResult,
        DROP COLUMN skinUserResultId;
    `);
  }
};
