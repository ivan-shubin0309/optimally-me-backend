'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        ADD COLUMN cancellationReason VARCHAR(200) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        DROP COLUMN cancellationReason;
    `);
  }
};
