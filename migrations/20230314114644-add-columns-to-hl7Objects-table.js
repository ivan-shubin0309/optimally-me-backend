'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        ADD COLUMN statusFileId INTEGER NULL,
        ADD CONSTRAINT fk_hl7ObjectStatusFile FOREIGN KEY (statusFileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE,
        ADD COLUMN resultFileId INTEGER NULL,
        ADD CONSTRAINT fk_hl7ObjectResultFile FOREIGN KEY (resultFileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        DROP FOREIGN KEY fk_hl7ObjectStatusFile,
        DROP COLUMN statusFileId,
        DROP FOREIGN KEY fk_hl7ObjectResultFile,
        DROP COLUMN resultFileId;
    `);
  }
};
