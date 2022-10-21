'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS recommendationImpacts (
        id INTEGER AUTO_INCREMENT,
         
        recommendationId INTEGER NOT NULL, 
        biomarkerId INTEGER NULL,

        descriptionHigh VARCHAR(255) NULL,
        impactLevelHigh INTEGER NOT NULL,
        qualityOfEvidenceHigh INTEGER NOT NULL,
        strengthOfEvidenceHigh INTEGER NOT NULL,
        descriptionLow VARCHAR(255) NULL,
        impactLevelLow INTEGER NOT NULL,
        qualityOfEvidenceLow INTEGER NOT NULL,
        strengthOfEvidenceLow INTEGER NOT NULL,

        createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY recommendation (recommendationId) REFERENCES recommendations (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY biomarker (biomarkerId) REFERENCES biomarkers (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`);
  },
  down(sequelizeInterface) {
    return sequelizeInterface.dropTable('recommendationImpacts');
  }
};
