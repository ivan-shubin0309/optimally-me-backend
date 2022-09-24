'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
        ALTER TABLE biomarkerFilters
          DROP sex,
          DROP age,
          DROP ethnicity,
          DROP otherFeatures;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
        ALTER TABLE biomarkerFilters
          ADD COLUMN sex TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - male, 2 - female',
          ADD COLUMN age TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - <=10, 2 - 11-20, 3 - 21-30, 4 - 31-40, 5 - 41-50, 6 - 51-60',
          ADD COLUMN ethnicity TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - white, 2 - indian, 3 - pakistani, 4 - bangladeshi, 5 - black caribbean, 6 - black african',
          ADD COLUMN otherFeatures TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - pregnant, 2 - menopause';
    `);
  }
};
