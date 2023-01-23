'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        ADD COLUMN skinUserResultId INTEGER NULL,
        ADD CONSTRAINT skinUserResult_fk1 FOREIGN KEY skinUserResult (skinUserResultId) REFERENCES skinUserResults (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        DROP FOREIGN KEY skinUserResult_fk1,
        DROP COLUMN skinUserResultId;
    `);
  }
};
