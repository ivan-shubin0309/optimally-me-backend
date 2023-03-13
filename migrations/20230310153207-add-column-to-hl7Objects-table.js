'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        ADD COLUMN fileId INTEGER NULL,
        ADD CONSTRAINT file_fk1_hl7Objects FOREIGN KEY file (fileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        DROP FOREIGN KEY file_fk1_hl7Objects,
        DROP COLUMN fileId;
    `);
  }
};
