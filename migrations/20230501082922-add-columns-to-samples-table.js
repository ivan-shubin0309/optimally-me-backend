'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE samples
        ADD COLUMN productName VARCHAR(255) NULL,
        ADD COLUMN labName VARCHAR(255) NULL,
        ADD COLUMN labProfileId VARCHAR(255) NULL,
        ADD COLUMN orderSource VARCHAR(255) NULL,
        ADD COLUMN orderId VARCHAR(255) NULL,
        ADD COLUMN expireAt DATE NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE samples
        DROP COLUMN productName,
        DROP COLUMN labName,
        DROP COLUMN labProfileId,
        DROP COLUMN orderSource,
        DROP COLUMN orderId,
        DROP COLUMN expireAt;
    `);
  }
};
