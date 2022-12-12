'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        MODIFY COLUMN biomarkerId INTEGER NULL,
        ADD COLUMN removedFromBiomarkerId INTEGER NULL,
        ADD CONSTRAINT removedFromBiomarker_fk FOREIGN KEY removedFromBiomarker (removedFromBiomarkerId) REFERENCES biomarkers (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE filters
        MODIFY COLUMN biomarkerId INTEGER NOT NULL,
        DROP CONSTRAINT removedFromBiomarker_fk,
        DROP COLUMN removedFromBiomarkerId;
    `);
  }
};
