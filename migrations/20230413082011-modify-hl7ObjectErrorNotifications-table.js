'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7ObjectErrorNotifications
        MODIFY COLUMN message VARCHAR(3000) NOT NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7ObjectErrorNotifications
        MODIFY COLUMN message VARCHAR(255) NOT NULL;
    `);
  }
};
