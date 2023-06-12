'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Templates
        DROP COLUMN isFavourite;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Templates
        ADD COLUMN isFavourite BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  }
};
