'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSkinDiaries
        MODIFY COLUMN isWearingMakeUp BOOLEAN NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSkinDiaries
        MODIFY COLUMN isWearingMakeUp BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  }
};
