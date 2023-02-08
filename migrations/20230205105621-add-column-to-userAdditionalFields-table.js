'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        ADD COLUMN isSensitiveSkin BOOLEAN NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        DROP COLUMN isSensitiveSkin;
    `);
  }
};
