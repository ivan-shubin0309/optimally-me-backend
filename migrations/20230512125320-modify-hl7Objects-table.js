'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY activatedAt DATETIME NULL,
        MODIFY sampleAt DATETIME NULL,
        MODIFY labReceivedAt DATETIME NULL,
        MODIFY resultAt DATETIME NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        MODIFY activatedAt DATE NULL,
        MODIFY sampleAt DATE NULL,
        MODIFY labReceivedAt DATE NULL,
        MODIFY resultAt DATE NULL;
    `);
  }
};
