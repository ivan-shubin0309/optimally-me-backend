'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitter
        ADD COLUMN isAppleHealthConnected BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN isSamsungHealthConnected BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN isAndroidSdkConnected BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userWefitter
        DROP COLUMN isAppleHealthConnected,
        DROP COLUMN isSamsungHealthConnected,
        DROP COLUMN isAndroidSdkConnected;
    `);
  }
};
