'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN toFollow VARCHAR(3000) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN toFollow VARCHAR(255) NULL;
    `);
  }
};
