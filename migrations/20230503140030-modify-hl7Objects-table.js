'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN orderId VARCHAR(255) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY COLUMN orderId INTEGER NULL;
    `);
  }
};
