'use strict';

module.exports = {
  up(queryInterface) {
    const createBiomarkerRulesTableSql = `
      CREATE TABLE IF NOT EXISTS biomarkers (
        id INTEGER AUTO_INCREMENT,

        templateId INTEGER NULL,
        unitId INTEGER NULL,
        categoryId INTEGER NULL,

        type TINYINT NOT NULL DEFAULT 1 COMMENT '1 - biomarker, 2 - rule',

        name VARCHAR (100) NULL,

        summary TEXT(5000) NULL,
        whatIsIt TEXT(5000) NULL,
        whatAreTheCauses TEXT(5000) NULL,
        whatAreTheRisks TEXT(5000) NULL,
        whatCanYouDo TEXT(5000) NULL,

        isDeleted BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY template (templateId) REFERENCES biomarkers (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY unit (unitId) REFERENCES units (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        FOREIGN KEY category (categoryId) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE, 
        PRIMARY KEY (id)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`.replace(/\s+/ig, ' ').trim();

    return queryInterface.sequelize.query(createBiomarkerRulesTableSql);
  },
  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS biomarkers;');
  }
};
