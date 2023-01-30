'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE skinUserResults
        ADD COLUMN perceivedAge TINYINT UNSIGNED NULL,
        ADD COLUMN eyesAge TINYINT UNSIGNED NULL,
        ADD COLUMN fileId INTEGER NULL,
        ADD CONSTRAINT file_fk1 FOREIGN KEY file (fileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE skinUserResults
        DROP COLUMN perceivedAge,
        DROP COLUMN eyesAge,
        DROP FOREIGN KEY file_fk1,
        DROP COLUMN fileId;
    `);
  }
};
