'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        ADD COLUMN pdfResultFileAt DATETIME NULL,
        ADD COLUMN pdfResultFileId INTEGER NULL,
        ADD CONSTRAINT fk_pdfResultFile FOREIGN KEY (pdfResultFileId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE hl7Objects
        DROP COLUMN pdfResultFileAt,
        DROP FOREIGN KEY fk_pdfResultFile,
        DROP COLUMN pdfResultFileId;
    `);
  }
};
