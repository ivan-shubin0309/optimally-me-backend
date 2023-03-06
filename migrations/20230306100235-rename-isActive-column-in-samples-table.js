'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE samples
        RENAME COLUMN isActive TO isActivated;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE samples
        RENAME COLUMN isActivated TO isActive;
    `);
  }
};
