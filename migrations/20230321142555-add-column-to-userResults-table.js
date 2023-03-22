'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        ADD COLUMN hl7ObjectId INTEGER NULL,
        ADD CONSTRAINT fk_hl7Object1 FOREIGN KEY (hl7ObjectId) REFERENCES hl7Objects (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE userResults
        DROP FOREIGN KEY fk_hl7Object1,
        DROP COLUMN hl7ObjectId;
    `);
  }
};
