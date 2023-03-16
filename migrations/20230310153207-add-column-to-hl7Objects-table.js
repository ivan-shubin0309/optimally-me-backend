'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        ADD COLUMN fileId INTEGER NULL,
        ADD CONSTRAINT fk_hl7ObjectFile FOREIGN KEY (fileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        DROP FOREIGN KEY fk_hl7ObjectFile,
        DROP COLUMN fileId;
    `);
  }
};
