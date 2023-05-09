'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userVerifiedDevices
        MODIFY COLUMN deviceId VARCHAR(255) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userVerifiedDevices
        MODIFY COLUMN deviceId VARCHAR(255) NOT NULL;
    `);
  }
};
