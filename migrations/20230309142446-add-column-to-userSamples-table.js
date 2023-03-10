'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSamples
        ADD COLUMN isHl7ObjectGenerated BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userSamples
        DROP COLUMN isHl7ObjectGenerated;
    `);
  }
};
