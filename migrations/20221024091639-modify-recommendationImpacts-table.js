'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendationImpacts
        MODIFY COLUMN impactLevelHigh INTEGER NULL,
        MODIFY COLUMN qualityOfEvidenceHigh INTEGER NULL,
        MODIFY COLUMN strengthOfEvidenceHigh INTEGER NULL,
        MODIFY COLUMN impactLevelLow INTEGER NULL,
        MODIFY COLUMN qualityOfEvidenceLow INTEGER NULL,
        MODIFY COLUMN strengthOfEvidenceLow INTEGER NULL;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE recommendationImpacts
        MODIFY COLUMN impactLevelHigh INTEGER NOT NULL,
        MODIFY COLUMN qualityOfEvidenceHigh INTEGER NOT NULL,
        MODIFY COLUMN strengthOfEvidenceHigh INTEGER NOT NULL,
        MODIFY COLUMN impactLevelLow INTEGER NOT NULL,
        MODIFY COLUMN qualityOfEvidenceLow INTEGER NOT NULL,
        MODIFY COLUMN strengthOfEvidenceLow INTEGER NOT NULL;
    `);
  }
};
