'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        ADD COLUMN unitId INTEGER NULL,
        ADD CONSTRAINT unit_fk FOREIGN KEY unit (unitId) REFERENCES units (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        DROP CONSTRAINT unit_fk,
        DROP COLUMN unitId;
    `);
  }
};
