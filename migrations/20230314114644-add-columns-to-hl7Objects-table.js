'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        ADD COLUMN statusFileId INTEGER NULL,
        ADD CONSTRAINT file_fk2_hl7Objects FOREIGN KEY file (fileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE,
        ADD COLUMN resultFileId INTEGER NULL,
        ADD CONSTRAINT file_fk3_hl7Objects FOREIGN KEY file (fileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        DROP FOREIGN KEY file_fk2_hl7Objects,
        DROP COLUMN statusFileId,
        DROP FOREIGN KEY file_fk3_hl7Objects,
        DROP COLUMN resultFileId;
    `);
  }
};
