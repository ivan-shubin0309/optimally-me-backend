'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerFiltersTableSql = `
      CREATE TABLE IF NOT EXISTS biomarkerFilters (
        id INTEGER AUTO_INCREMENT,
 
        ruleId INTEGER NOT NULL,
        name VARCHAR (200) NOT NULL,
        sex TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - male, 2 - female',
        age TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - <=10, 2 - 11-20, 3 - 21-30, 4 - 31-40, 5 - 41-50, 6 - 51-60',
        ethnicity TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - white, 2 - indian, 3 - pakistani, 4 - bangladeshi, 5 - black caribbean, 6 - black african',
        otherFeatures TINYINT NOT NULL DEFAULT 0 COMMENT '0 - all, 1 - pregnant, 2 - menopause',

        criticalLow FLOAT NULL,
        lowMin FLOAT NULL,
        lowMax FLOAT NULL,
        subOptimalMin FLOAT NULL,
        subOptimalMax FLOAT NULL,
        optimalMin FLOAT NULL,
        optimalMax FLOAT NULL,
        supraOptimalMin FLOAT NULL,
        supraOptimalMax FLOAT NULL,
        HighMin FLOAT NULL,
        HighMax FLOAT NULL,
        criticalHigh FLOAT NULL,

        recommendationsIsOn  BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY biomarkerRule (ruleId) REFERENCES biomarkerRules (id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerFiltersTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS biomarkerFilters;');
  }
};
