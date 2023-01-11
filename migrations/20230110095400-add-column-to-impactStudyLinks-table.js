'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE impactStudyLinks
        ADD COLUMN title VARCHAR(200) NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE impactStudyLinks
        DROP COLUMN title;
    `);
  }
};
