'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        ADD COLUMN isSelfAssesmentQuizCompleted BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userAdditionalFields
        DROP COLUMN isSelfAssesmentQuizCompleted;
    `);
  }
};
